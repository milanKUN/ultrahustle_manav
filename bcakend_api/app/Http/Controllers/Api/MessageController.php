<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $conversations = Conversation::where('participant_one_id', $user->id)
            ->orWhere('participant_two_id', $user->id)
            ->with(['participantOne.personalInfo', 'participantTwo.personalInfo', 'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->orderByDesc('last_message_at')
            ->get();

        $data = $conversations->map(function ($conv) use ($user) {
            $otherUser = ($conv->participant_one_id === $user->id) ? $conv->participantTwo : $conv->participantOne;
            $lastMessage = $conv->messages->first();

            return [
                'id' => $conv->id,
                'name' => $otherUser->full_name ?? $otherUser->username,
                'handle' => '@' . $otherUser->username,
                'avatar_url' => $otherUser->personalInfo && $otherUser->personalInfo->avatar_path 
                    ? Storage::disk('public')->url($otherUser->personalInfo->avatar_path) 
                    : null,
                'preview' => $lastMessage ? $lastMessage->content : '',
                'time' => $conv->last_message_at ? $conv->last_message_at->diffForHumans() : '',
                'timestamp' => $conv->last_message_at ? $conv->last_message_at->timestamp : null,
                'last_message_at' => $conv->last_message_at,
                'is_typing' => $conv->typing_until && $conv->typing_until->isFuture() && $conv->typing_user_id !== $user->id,
                'online' => false, // Placeholder for now
                'other_user_id' => $otherUser->id,
                'listing_id' => $conv->listing_id,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $conversation = Conversation::where('id', $id)
            ->where(function($q) use ($user) {
                $q->where('participant_one_id', $user->id)
                  ->orWhere('participant_two_id', $user->id);
            })->firstOrFail();

        $messages = Message::where('conversation_id', $id)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark other user's messages as read
        Message::where('conversation_id', $id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        $formattedMessages = $messages->map(function($msg) use ($user) {
            return [
                'id' => $msg->id,
                'sender' => $msg->sender->full_name ?? $msg->sender->username,
                'sender_id' => $msg->sender_id,
                'text' => $msg->content,
                'time' => $msg->created_at->timestamp,
                'is_me' => $msg->sender_id === $user->id,
                'tone' => $msg->sender_id === $user->id ? 'light' : 'dark',
                'is_read' => $msg->is_read || $msg->read_at !== null,
                'read_at' => $msg->read_at ? $msg->read_at->timestamp : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedMessages
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'receiver_id' => 'required_without:conversation_id|exists:users,id',
            'conversation_id' => 'nullable|exists:conversations,id',
            'listing_id' => 'nullable',
        ]);

        $user = $request->user();
        $conversationId = $request->conversation_id;

        if (!$conversationId) {
            $receiverId = $request->receiver_id;
            
            // Check if conversation already exists
            $conversation = Conversation::where(function($q) use ($user, $receiverId) {
                $q->where('participant_one_id', $user->id)->where('participant_two_id', $receiverId);
            })->orWhere(function($q) use ($user, $receiverId) {
                $q->where('participant_one_id', $receiverId)->where('participant_two_id', $user->id);
            })->first();

            if (!$conversation) {
                $conversation = Conversation::create([
                    'participant_one_id' => $user->id,
                    'participant_two_id' => $receiverId,
                    'listing_id' => $request->listing_id,
                    'last_message_at' => now(),
                ]);
            }
            $conversationId = $conversation->id;
        } else {
            $conversation = Conversation::findOrFail($conversationId);
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $user->id,
            'content' => $request->content,
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $message->id,
                'sender' => $user->full_name ?? $user->username,
                'sender_id' => $user->id,
                'text' => $message->content,
                'time' => $message->created_at->timestamp,
                'is_me' => true,
                'tone' => 'light',
            ]
        ]);
    }

    public function setTyping(Request $request, $id)
    {
        $user = $request->user();
        $isTyping = $request->input('is_typing', false);

        $conversation = Conversation::where('id', $id)
            ->where(function($q) use ($user) {
                $q->where('participant_one_id', $user->id)
                  ->orWhere('participant_two_id', $user->id);
            })->firstOrFail();

        if ($isTyping) {
            $conversation->update([
                'typing_user_id' => $user->id,
                'typing_until' => now()->addSeconds(5)
            ]);
        } else {
            $conversation->update([
                'typing_user_id' => null,
                'typing_until' => null
            ]);
        }

        return response()->json(['success' => true]);
    }
}
