<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ListingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'listing_type' => 'required|in:course,digital_product,webinar,service',
            'status' => 'nullable|in:draft,published',

            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:150',
            'sub_category' => 'nullable|string|max:150',
            'short_description' => 'nullable|string',
            'about' => 'nullable|string',

            'ai_powered' => 'nullable|boolean',
            'seller_mode' => 'nullable|in:Solo,Team',
            'team_name' => 'nullable|string|max:255',

            'cover_file' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv|max:20480',

            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:100',

            'details.tools' => 'nullable|array',
            'details.tools.*' => 'nullable|string|max:255',

            'faqs' => 'nullable|array',
            'faqs.*.q' => 'nullable|string',
            'faqs.*.a' => 'nullable|string',

            'links' => 'nullable|array',
            'links.*' => 'nullable|string',

            'deliverables' => 'nullable|array',
            'deliverables.*.file' => 'nullable|file|max:20480',
            'deliverables.*.notes' => 'nullable|string',

            'details' => 'nullable|array',
            'details.product_type' => 'nullable|string|max:150',

            'details.packages' => 'nullable|array',
            'details.packages.*.package_name' => 'required_with:details.packages|string|in:Basic,Standard,Premium',
            'details.packages.*.price' => 'nullable',
            'details.packages.*.included' => 'nullable|array',
            'details.packages.*.included.*' => 'nullable|string|max:255',
            'details.packages.*.deliveryFormats' => 'nullable|array',
            'details.packages.*.deliveryFormats.*' => 'nullable|string|max:255',
            'details.course_level' => 'nullable|string|max:100',

            'details.learning_points' => 'nullable|array',
            'details.learning_points.*' => 'nullable|string|max:255',

            'details.languages' => 'nullable|array',
            'details.languages.*' => 'nullable|string|max:100',

            'details.preview_video_file' => 'nullable|file|mimes:mp4,mov,avi,mkv,webm|max:51200',

            'details.lessons' => 'nullable|array',
            'details.lessons.*.title' => 'nullable|string|max:255',
            'details.lessons.*.description' => 'nullable|string',
            'details.lessons.*.media_file' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv,webm|max:20480',
            'details.lessons.*.media_type' => 'nullable|in:image,video',
        ]);

        $listing = DB::transaction(function () use ($request, $user, $validated) {
            $coverPath = null;

            if ($request->hasFile('cover_file')) {
                $coverPath = $request->file('cover_file')->store('listings/covers', 'public');
            }

            $cleanTags = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                $validated['tags'] ?? []
            )));

            $cleanTools = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.tools', [])
            )));

            $listingId = DB::table('listings')->insertGetId([
                'user_id' => $user->id,
                'listing_type' => $validated['listing_type'],
                'title' => $validated['title'],
                'category' => $validated['category'] ?? null,
                'sub_category' => $validated['sub_category'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'about' => $validated['about'] ?? null,
                'seller_mode' => $validated['seller_mode'] ?? 'Solo',
                'team_name' => $validated['team_name'] ?? null,
                'tags_json' => !empty($cleanTags) ? json_encode($cleanTags) : null,
                'tools_json' => !empty($cleanTools) ? json_encode($cleanTools) : null,
                'ai_powered' => (int) ($validated['ai_powered'] ?? false),
                'cover_media_path' => $coverPath,
                'status' => $validated['status'] ?? 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

           /*  foreach (($validated['tags'] ?? []) as $index => $tag) {
                if (!filled($tag)) continue;

                DB::table('listing_tags')->insert([
                    'listing_id' => $listingId,
                    'tag' => $tag,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } */

            foreach (($validated['faqs'] ?? []) as $index => $faq) {
                $question = trim((string) ($faq['q'] ?? ''));
                $answer = trim((string) ($faq['a'] ?? ''));

                if ($question === '' && $answer === '') continue;

                DB::table('listing_faqs')->insert([
                    'listing_id' => $listingId,
                    'question' => $question,
                    'answer' => $answer,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach (($validated['links'] ?? []) as $index => $link) {
                $value = trim((string) $link);
                if ($value === '') continue;

                DB::table('listing_links')->insert([
                    'listing_id' => $listingId,
                    'link_url' => $value,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach (($request->input('deliverables', []) ?? []) as $index => $deliverableInput) {
                $file = $request->file("deliverables.$index.file");
                $notes = trim((string) ($deliverableInput['notes'] ?? ''));

                if (!$file && $notes === '') continue;

                $filePath = null;
                $fileName = null;
                $fileMime = null;
                $fileSize = null;

                if ($file) {
                    $filePath = $file->store('listings/deliverables', 'public');
                    $fileName = $file->getClientOriginalName();
                    $fileMime = $file->getMimeType();
                    $fileSize = $file->getSize();
                }

                DB::table('listing_deliverables')->insert([
                    'listing_id' => $listingId,
                    'file_path' => $filePath,
                    'file_name' => $fileName,
                    'file_mime' => $fileMime,
                    'file_size' => $fileSize,
                    'notes' => $notes ?: null,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if (($validated['listing_type'] ?? '') === 'digital_product') {
                if (Schema::hasTable('digital_product_details')) {
                    DB::table('digital_product_details')->insert([
                        'listing_id' => $listingId,
                        'product_type' => data_get($validated, 'details.product_type'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                foreach ((data_get($validated, 'details.packages') ?? []) as $package) {
                    $price = $package['price'] ?? null;

                    $included = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        $package['included'] ?? []
                    )));

                    $deliveryFormats = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        $package['deliveryFormats'] ?? []
                    )));

                    $hasData =
                        ($price !== null && $price !== '') ||
                        !empty($included) ||
                        !empty($deliveryFormats);

                    if (!$hasData) {
                        continue;
                    }

                    $packageId = DB::table('digital_product_packages')->insertGetId([
                        'listing_id' => $listingId,
                        'package_name' => $package['package_name'],
                        'price' => ($price !== '' && $price !== null) ? $price : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    if (!empty($included)) {
                        DB::table('digital_product_package_items')->insert([
                            'package_id' => $packageId,
                            'item_type' => 'included',
                            'item_value_json' => json_encode($included),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    if (!empty($deliveryFormats)) {
                        DB::table('digital_product_package_items')->insert([
                            'package_id' => $packageId,
                            'item_type' => 'delivery_format',
                            'item_value_json' => json_encode($deliveryFormats),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
            //course specific data
            if (($validated['listing_type'] ?? '') === 'course') {
                $learningPoints = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.learning_points', [])
                )));

                $languages = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.languages', [])
                )));

                $previewVideo = $request->file('details.preview_video_file');

                $previewVideoPath = null;
                $previewVideoName = null;
                $previewVideoMime = null;
                $previewVideoSize = null;

                if ($previewVideo) {
                    $previewVideoPath = $previewVideo->store('listings/course/preview-videos', 'public');
                    $previewVideoName = $previewVideo->getClientOriginalName();
                    $previewVideoMime = $previewVideo->getMimeType();
                    $previewVideoSize = $previewVideo->getSize();
                }

                DB::table('course_listing_details')->insert([
                    'listing_id' => $listingId,
                    'course_level' => data_get($validated, 'details.course_level'),
                    'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                    'languages_json' => !empty($languages) ? json_encode($languages) : null,
                    'preview_video_path' => $previewVideoPath,
                    'preview_video_name' => $previewVideoName,
                    'preview_video_mime' => $previewVideoMime,
                    'preview_video_size' => $previewVideoSize,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                foreach ((data_get($validated, 'details.lessons') ?? []) as $index => $lesson) {
                    $title = trim((string) ($lesson['title'] ?? ''));
                    $description = trim((string) ($lesson['description'] ?? ''));
                    $mediaType = $lesson['media_type'] ?? null;

                    $mediaFile = $request->file("details.lessons.$index.media_file");

                    if ($title === '' && $description === '' && !$mediaFile) {
                        continue;
                    }

                    $mediaPath = null;
                    $mediaName = null;
                    $mediaMime = null;
                    $mediaSize = null;

                    if ($mediaFile) {
                        $mediaPath = $mediaFile->store('listings/course/lessons', 'public');
                        $mediaName = $mediaFile->getClientOriginalName();
                        $mediaMime = $mediaFile->getMimeType();
                        $mediaSize = $mediaFile->getSize();

                        if (!$mediaType) {
                            $mediaType = str_starts_with((string) $mediaMime, 'video/') ? 'video' : 'image';
                        }
                    }

                    DB::table('course_listing_lessons')->insert([
                        'listing_id' => $listingId,
                        'title' => $title ?: null,
                        'description' => $description ?: null,
                        'media_type' => $mediaType,
                        'media_path' => $mediaPath,
                        'media_name' => $mediaName,
                        'media_mime' => $mediaMime,
                        'media_size' => $mediaSize,
                        'sort_order' => $index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            return DB::table('listings')->where('id', $listingId)->first();
        });

        return response()->json([
            'success' => true,
            'message' => 'Listing saved successfully.',
            'listing_id' => $listing->id,
            'listing' => $listing,
        ]);
    }

    //my listings
    public function myListings(Request $request): JsonResponse
{
    $user = $request->user();

    $listings = DB::table('listings')
        ->where('user_id', $user->id)
        ->orderByDesc('id')
        ->get([
            'id',
            'title',
            'listing_type',
            'status',
            'cover_media_path',
            'created_at',
            'updated_at',
        ]);

    return response()->json([
        'success' => true,
        'listings' => $listings,
    ]);
}
}