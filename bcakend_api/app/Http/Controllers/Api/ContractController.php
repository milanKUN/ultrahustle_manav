<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Contract;
use App\Models\ContractDeliverable;
use App\Models\ContractMilestone;
use App\Models\ContractActivity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContractReviewMail;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $status = $request->query('status');
        $role = $request->query('role', 'creator'); // creator or client

        $query = Contract::with(['deliverables', 'milestones']);

        if ($role === 'creator') {
            $query->where(function($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('provider_username', $user->username);
            });
        } else {
            $query->where(function($q) use ($user) {
                $q->where('client_id', $user->id)
                  ->orWhere('client_username', $user->username)
                  ->orWhere('client_email', $user->email);
            });
        }

        if ($status && $status !== 'Total') {
            if ($status === 'In Review') {
                $query->where('status', 'Review');
            } else {
                $query->where('status', $status);
            }
        }

        $contracts = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $contracts,
        ]);
    }

    public function store(Request $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $validated = $request->validate([
                    'contract_id' => 'required|string',
                    'title' => 'required|string',
                    'type' => 'nullable|string',
                    'client_username' => 'nullable|string',
                    'client_full_name' => 'nullable|string',
                    'client_email' => 'nullable|email',
                    'client_company' => 'nullable|string',
                    'provider_username' => 'nullable|string',
                    'provider_full_name' => 'nullable|string',
                    'provider_email' => 'nullable|email',
                    'provider_company' => 'nullable|string',
                    'project_summary' => 'nullable|string',
                    'out_of_scope' => 'nullable|string',
                    'initial_delivery_deadline' => 'nullable|date',
                    'client_review_window' => 'nullable|string',
                    'revision_rounds' => 'nullable|integer',
                    'revision_turnaround_time' => 'nullable|string',
                    'late_delivery_consequence' => 'nullable|string',
                    'delivery_sla' => 'nullable|string',
                    'communication_sla' => 'nullable|string',
                    'revision_sla' => 'nullable|string',
                    'quality_standards' => 'nullable|string',
                    'client_responsibilities' => 'nullable|string',
                    'provider_responsibilities' => 'nullable|string',
                    'payment_type' => 'nullable|string',
                    'project_cost' => 'nullable|numeric',
                    'status' => 'nullable|string',
                    'deliverables' => 'nullable|array',
                    'milestones' => 'nullable|array',
                    'final_client_name' => 'nullable|string',
                    'final_creator_name' => 'nullable|string',
                    'review_turn' => 'nullable|string',
                ]);

                $user = auth()->user();
                $contractId = $validated['contract_id'];
                
                $contractData = array_merge($validated, [
                    'created_by' => $user->id ?? null,
                ]);

                // Link client_id if email exists
                if (!empty($contractData['client_email'])) {
                    $client = User::where('email', $contractData['client_email'])->first();
                    if ($client) {
                        $contractData['client_id'] = $client->id;
                    }
                }

                if (!empty($contractData['initial_delivery_deadline'])) {
                    try {
                        $contractData['initial_delivery_deadline'] = \Carbon\Carbon::parse($contractData['initial_delivery_deadline'])->format('Y-m-d');
                    } catch (\Exception $e) {}
                }

                $existing = Contract::where('contract_id', $contractId)->first();

                // If sending for review, set turn
                if ($contractData['status'] === 'Review') {
                    if ($existing) {
                        // Swap turn if it was already in review
                        $userRole = ($user->id === $existing->created_by) ? 'creator' : 'client';
                        $contractData['review_turn'] = ($userRole === 'creator') ? 'client' : 'creator';
                    } else {
                        // New contract being sent for review by creator
                        $contractData['review_turn'] = 'client';
                    }
                }

                $isNew = false;
                
                if ($existing) {
                    $isUpdate = $request->has('id') || $request->has('record_id') || $request->has('id');
                    // Check if it's the user's turn to edit
                    if ($existing->status === 'Review' && $existing->review_turn) {
                        $userRole = ($user->id === $existing->created_by) ? 'creator' : 'client';
                        if ($existing->review_turn !== $userRole) {
                            throw new \Exception("It is not your turn to edit this contract.");
                        }
                    }

                    $contract = $existing;
                    $contract->update($contractData);
                } else {
                    $contract = Contract::create($contractData);
                    $isNew = true;
                }

                // Save deliverables
                if (isset($validated['deliverables'])) {
                    $contract->deliverables()->delete();
                    foreach ($validated['deliverables'] as $deliverable) {
                        if (!empty($deliverable['title'])) {
                            $contract->deliverables()->create($deliverable);
                        }
                    }
                }

                // Save milestones
                if (isset($validated['milestones'])) {
                    $contract->milestones()->delete();
                    foreach ($validated['milestones'] as $milestone) {
                        if (!empty($milestone['title'])) {
                            if (!empty($milestone['deadline'])) {
                                try {
                                    $milestone['deadline'] = \Carbon\Carbon::parse($milestone['deadline'])->format('Y-m-d');
                                } catch (\Exception $e) {}
                            }
                            $contract->milestones()->create($milestone);
                        }
                    }
                }

                // Log Activity
                $action = $isNew ? 'Contract Created' : 'Contract Updated';
                if ($contract->status === 'Review' && $contract->wasChanged('status')) {
                    $action = 'Sent for Review';
                }

                $this->logActivity($contract->id, $user->id ?? null, $action, [
                    'title' => $contract->title,
                    'status' => $contract->status,
                    'turn' => $contract->review_turn
                ]);

                // Send email if status is 'Review'
                if ($contract->status === 'Review' && !empty($contract->client_email)) {
                    try {
                        Mail::to($contract->client_email)->send(new ContractReviewMail($contract));
                    } catch (\Exception $e) {
                        Log::error('Failed to send review email: ' . $e->getMessage());
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Contract saved successfully',
                    'data' => $contract->load(['deliverables', 'milestones']),
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error saving contract: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error saving contract: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $contract_id)
    {
        $request->validate([
            'status' => 'required|string',
            'action' => 'nullable|string',
            'details' => 'nullable|string'
        ]);
    
        $contract = Contract::where('contract_id', $contract_id)->firstOrFail();
        $oldStatus = $contract->status;
        $user = auth()->user();
        $userRole = ($user->id === $contract->created_by) ? 'creator' : 'client';
    
        // Custom transition logic
        if ($request->status === 'Active') {
            $contract->status = 'Active';
            $contract->review_turn = null;
        } elseif ($request->status === 'Client_Accepted') {
            $contract->status = 'Accepted';
            $contract->review_turn = 'creator';
            $actionLabel = 'Accepted by Client';
        } elseif ($request->status === 'Review' && $request->action === 'Sent back for Review') {
            $contract->status = 'Review';
            $contract->review_turn = ($userRole === 'creator') ? 'client' : 'creator';
        } else {
            $contract->status = $request->status;
        }
    
        $contract->save();
    
        $this->logActivity($contract->id, $user->id, $request->action ?? $actionLabel ?? 'Status Updated', [
            'from' => $oldStatus,
            'to' => $contract->status,
            'turn' => $contract->review_turn,
            'details' => $request->details
        ]);
    
        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $contract
        ]);
    }

    public function requestResolution(Request $request, $contract_id)
    {
        $request->validate([
            'type' => 'required|in:extension,cancellation',
            'reason' => 'required|string',
            'days' => 'nullable|string',
        ]);

        $contract = Contract::where('contract_id', $contract_id)->firstOrFail();
        $user = auth()->user();
        $userRole = ($user->id === $contract->created_by) ? 'creator' : 'client';

        if ($request->type === 'extension') {
            $contract->status = 'Extension_Requested';
            $action = 'Extension Requested';
            $details = "Requested {$request->days} extension. Reason: {$request->reason}";
        } else {
            $contract->status = 'Cancellation_Requested';
            $action = 'Cancellation Requested';
            $details = "Requested cancellation. Reason: {$request->reason}";
        }

        $contract->save();

        $this->logActivity($contract->id, $user->id, $action, [
            'details' => $details,
            'requester_role' => $userRole
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Resolution request submitted',
            'data' => $contract
        ]);
    }

    public function submitMilestone(Request $request, $milestone_id)
    {
        $request->validate([
            'files' => 'nullable|array',
            'links' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        $milestone = ContractMilestone::findOrFail($milestone_id);
        $milestone->status = 'Submitted';
        $milestone->save();

        $this->logActivity($milestone->contract_record_id, auth()->id(), 'Milestone Submitted', [
            'milestone_title' => $milestone->title,
            'details' => $request->description,
            'files' => $request->files,
            'links' => $request->links,
            'tags' => ['Delivery']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Milestone submitted for approval',
            'data' => $milestone
        ]);
    }

    public function approveMilestone(Request $request, $milestone_id)
    {
        $milestone = ContractMilestone::findOrFail($milestone_id);
        $milestone->status = 'Paid'; // Or 'Approved'
        $milestone->save();

        $this->logActivity($milestone->contract_record_id, auth()->id(), 'Milestone Approved', [
            'milestone_title' => $milestone->title,
            'details' => 'Client approved the delivery.',
            'tags' => ['Payment']
        ]);

        // Check if all milestones are paid
        $contract = $milestone->contract;
        $total = $contract->milestones()->count();
        $paid = $contract->milestones()->where('status', 'Paid')->count();
        if ($total === $paid) {
            $contract->status = 'Completed';
            $contract->save();
            $this->logActivity($contract->id, null, 'Project Completed');
        }

        return response()->json([
            'success' => true,
            'message' => 'Milestone approved',
            'data' => $milestone
        ]);
    }

    public function requestRevision(Request $request, $milestone_id)
    {
        $request->validate([
            'notes' => 'required|string',
        ]);

        $milestone = ContractMilestone::findOrFail($milestone_id);
        $milestone->status = 'Revision Requested';
        $milestone->save();

        $this->logActivity($milestone->contract_record_id, auth()->id(), 'Revision Requested', [
            'milestone_title' => $milestone->title,
            'details' => $request->notes,
            'tags' => ['Revision']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Revision requested',
            'data' => $milestone
        ]);
    }

    public function acceptRevision(Request $request, $milestone_id)
    {
        $milestone = ContractMilestone::findOrFail($milestone_id);
        $milestone->status = 'In-Progress'; // Or keep as Revision Requested? Usually back to In-Progress
        $milestone->save();

        $this->logActivity($milestone->contract_record_id, auth()->id(), 'Revision Accepted', [
            'milestone_title' => $milestone->title,
            'details' => 'Creator has accepted the revision request and is working on it.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Revision accepted',
            'data' => $milestone
        ]);
    }

    public function cancelRevision(Request $request, $milestone_id)
    {
        $milestone = ContractMilestone::findOrFail($milestone_id);
        // Maybe move to Dispute? Or just back to Submitted if they refuse the revision
        $milestone->status = 'Submitted'; 
        $milestone->save();

        $this->logActivity($milestone->contract_record_id, auth()->id(), 'Revision Declined', [
            'milestone_title' => $milestone->title,
            'details' => 'Creator has declined the revision request.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Revision declined',
            'data' => $milestone
        ]);
    }

    public function show($contract_id)
    {
        $contract = Contract::with(['deliverables', 'milestones', 'activities.actor'])
            ->where('contract_id', $contract_id)
            ->first();

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'Contract not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $contract,
        ]);
    }

    private function logActivity($recordId, $actorId, $action, $details = null)
    {
        return ContractActivity::create([
            'contract_record_id' => $recordId,
            'actor_id' => $actorId,
            'action' => $action,
            'details' => $details
        ]);
    }
}
