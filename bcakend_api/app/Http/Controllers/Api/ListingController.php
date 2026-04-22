<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;

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
        'prerequisites' => 'nullable|string',

        'ai_powered' => 'nullable|boolean',
        'seller_mode' => 'nullable|in:Solo,Team',
        'team_name' => 'nullable|string|max:255',

        'cover_files' => 'nullable|array',
        'cover_files.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv|max:20480',

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
        'details.price' => 'nullable|numeric|min:0',
        'details.included' => 'nullable|array',
        'details.included.*' => 'nullable|string|max:255',
        'details.delivery_format' => 'nullable|string|max:255',

        'portfolio_projects' => 'nullable|array',
        'portfolio_projects.*.title' => 'nullable|string|max:255',
        'portfolio_projects.*.description' => 'nullable|string',
        'portfolio_projects.*.cost' => 'nullable|string|max:100',
        'portfolio_projects.*.sort_order' => 'nullable|integer|min:0',
        'portfolio_projects.*.files' => 'nullable|array',
        'portfolio_projects.*.files.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv,webm|max:20480',

        'details.course_level' => 'nullable|string|max:100',
        'details.learning_points' => 'nullable|array',
        'details.learning_points.*' => 'nullable|string|max:255',
        'details.languages' => 'nullable|array',
        'details.languages.*' => 'nullable|string|max:100',
        'details.key_outcomes' => 'nullable|array',
        'details.key_outcomes.*' => 'nullable|string|max:100',
        'details.preview_video_file' => 'nullable|file|mimes:mp4,mov,avi,mkv,webm|max:51200',

        'details.lessons' => 'nullable|array',
        'details.lessons.*.title' => 'nullable|string|max:255',
        'details.lessons.*.description' => 'nullable|string',
        'details.lessons.*.media_file' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv,webm|max:20480',
        'details.lessons.*.media_type' => 'nullable|in:image,video',

        'details.schedule_date' => 'nullable|date',
        'details.schedule_start_time' => 'nullable',
        'details.schedule_duration' => 'nullable|integer|min:1',
        'details.schedule_timezone' => 'nullable|string|max:100',
        'details.webinar_link' => 'nullable|string|max:2048',
        'details.ticket_price' => 'nullable|numeric|min:0',
        'details.agenda' => 'nullable|array',
        'details.agenda.*.time' => 'nullable|string|max:100',
        'details.agenda.*.topic' => 'nullable|string|max:255',
        'details.agenda.*.description' => 'nullable|string',

        // service
        'details.packages' => 'nullable|array',
        'details.packages.*.package_name' => 'nullable|string|max:100',
        'details.packages.*.price' => 'nullable|numeric|min:0',
        'details.packages.*.delivery_days' => 'nullable|integer|min:0',
        'details.packages.*.revisions' => 'nullable|integer|min:0',
        'details.packages.*.scope' => 'nullable|string',
        'details.packages.*.included' => 'nullable|array',
        'details.packages.*.included.*' => 'nullable|string|max:255',
        'details.packages.*.how_it_works' => 'nullable|array',
        'details.packages.*.how_it_works.*' => 'nullable|string|max:255',
        'details.packages.*.not_included' => 'nullable|array',
        'details.packages.*.not_included.*' => 'nullable|string|max:255',
        'details.packages.*.tools_used' => 'nullable|array',
        'details.packages.*.tools_used.*' => 'nullable|string|max:255',
        'details.packages.*.delivery_format' => 'nullable|string|max:255',

        'details.add_ons' => 'nullable|array',
        'details.add_ons.*.name' => 'nullable|string|max:255',
        'details.add_ons.*.price' => 'nullable|numeric|min:0',
        'details.add_ons.*.days' => 'nullable|integer|min:0',
    ]);

    $username = $this->makeUniqueUsername($validated['title']);

    $listing = DB::transaction(function () use ($request, $user, $validated, $username) {
        $coverPath = null;
        $galleryPaths = [];

        if ($request->hasFile('cover_files')) {
            foreach ($request->file('cover_files') as $idx => $file) {
                if ($file) {
                    $path = $file->store('listings/covers', 'public');
                    if ($idx === 0) {
                        $coverPath = $path;
                    }
                    $galleryPaths[] = $path;
                }
            }
        } else if ($request->hasFile('cover_file')) {
            $coverPath = $request->file('cover_file')->store('listings/covers', 'public');
            $galleryPaths[] = $coverPath;
        }

        $cleanTags = array_values(array_filter(array_map(
            fn($v) => trim((string) $v),
            $validated['tags'] ?? []
        )));

        $cleanTools = array_values(array_filter(array_map(
            fn($v) => trim((string) $v),
            data_get($validated, 'details.tools', [])
        )));

        $listingPrice = null;

        if (($validated['listing_type'] ?? '') === 'digital_product') {
            $listingPrice = data_get($validated, 'details.price');
        } elseif (($validated['listing_type'] ?? '') === 'webinar') {
            $listingPrice = data_get($validated, 'details.ticket_price');
        } elseif (($validated['listing_type'] ?? '') === 'course') {
            $listingPrice = data_get($validated, 'details.price');
        } elseif (($validated['listing_type'] ?? '') === 'service') {
            $packagePrices = collect((array) data_get($validated, 'details.packages', []))
                ->pluck('price')
                ->filter(fn($price) => $price !== null && $price !== '' && (float) $price > 0)
                ->map(fn($price) => (float) $price)
                ->values();

            $listingPrice = $packagePrices->isNotEmpty()
                ? (float) $packagePrices->min()
                : data_get($validated, 'details.price');
        }

        $listingId = DB::table('listings')->insertGetId([
            'user_id' => $user->id,
            'username' => $username,
            'listing_type' => $validated['listing_type'],
            'title' => $validated['title'],
            'category' => $validated['category'] ?? null,
            'sub_category' => $validated['sub_category'] ?? null,
            'price' => $listingPrice,
            'short_description' => $validated['short_description'] ?? null,
            'about' => $validated['prerequisites'] ?? null,
            'seller_mode' => $validated['seller_mode'] ?? 'Solo',
            'team_name' => $validated['team_name'] ?? null,
            'tags_json' => !empty($cleanTags) ? json_encode($cleanTags) : null,
            'tools_json' => !empty($cleanTools) ? json_encode($cleanTools) : null,
            'ai_powered' => (int) ($validated['ai_powered'] ?? false),
            'cover_media_path' => $coverPath,
            'gallery_json' => !empty($galleryPaths) ? json_encode($galleryPaths) : null,
            'status' => $validated['status'] ?? 'published',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

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
            $included = array_values(array_filter(array_map(
                fn ($v) => trim((string) $v),
                data_get($validated, 'details.included', [])
            )));

            if (Schema::hasTable('digital_product_details')) {
                DB::table('digital_product_details')->insert([
                    'listing_id' => $listingId,
                    'product_type' => data_get($validated, 'details.product_type'),
                    'price' => data_get($validated, 'details.price'),
                    'included_json' => !empty($included) ? json_encode($included) : null,
                    'delivery_format' => data_get($validated, 'details.delivery_format'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        if (($validated['listing_type'] ?? '') === 'course') {
            $learningPoints = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.learning_points', [])
            )));

            $languages = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.languages', [])
            )));

            $includedRaw = data_get($validated, 'details.included', []);
            $included = is_array($includedRaw)
                ? array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    $includedRaw
                ), fn($v) => $v !== ''))
                : [];

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
                'product_type' => data_get($validated, 'details.product_type'),
                'included_json' => json_encode($included),
                'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                'languages_json' => !empty($languages) ? json_encode($languages) : null,
                'preview_video_mime' => $previewVideoMime,
                'preview_video_size' => $previewVideoSize,
                'about_course' => $validated['about'] ?? null,
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

        if (($validated['listing_type'] ?? '') === 'webinar') {
            $learningPoints = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.learning_points', [])
            )));

            $languages = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.languages', [])
            )));

            $keyOutcomes = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.key_outcomes', [])
            )));

            if (Schema::hasTable('webinar_listing_details')) {
                DB::table('webinar_listing_details')->insert([
                    'listing_id' => $listingId,
                    'ticket_price' => data_get($validated, 'details.ticket_price'),
                    'product_type' => data_get($validated, 'details.product_type'),
                    'schedule_date' => data_get($validated, 'details.schedule_date'),
                    'schedule_start_time' => data_get($validated, 'details.schedule_start_time'),
                    'schedule_duration' => data_get($validated, 'details.schedule_duration'),
                    'schedule_timezone' => data_get($validated, 'details.schedule_timezone'),
                    'webinar_link' => data_get($validated, 'details.webinar_link'),
                    'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                    'languages_json' => !empty($languages) ? json_encode($languages) : null,
                    'key_outcomes' => !empty($keyOutcomes) ? json_encode($keyOutcomes) : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if (Schema::hasTable('webinar_listing_agendas')) {
                foreach ((data_get($validated, 'details.agenda') ?? []) as $index => $agendaItem) {
                    $time = trim((string) ($agendaItem['time'] ?? ''));
                    $topic = trim((string) ($agendaItem['topic'] ?? ''));
                    $description = trim((string) ($agendaItem['description'] ?? ''));

                    if ($time === '' && $topic === '' && $description === '') {
                        continue;
                    }

                    DB::table('webinar_listing_agendas')->insert([
                        'listing_id' => $listingId,
                        'time' => $time ?: null,
                        'topic' => $topic ?: null,
                        'description' => $description ?: null,
                        'sort_order' => $index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        if (($validated['listing_type'] ?? '') === 'service') {
            $packages = collect((array) data_get($validated, 'details.packages', []))
                ->map(function ($item, $index) {
                    $included = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['included'] ?? [])
                    ), fn($v) => $v !== ''));

                    $howItWorks = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['how_it_works'] ?? [])
                    ), fn($v) => $v !== ''));

                    $notIncluded = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['not_included'] ?? [])
                    ), fn($v) => $v !== ''));

                    $toolsUsed = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['tools_used'] ?? [])
                    ), fn($v) => $v !== ''));

                    return [
                        'package_name' => trim((string) ($item['package_name'] ?? ['Basic', 'Standard', 'Premium'][$index] ?? 'Package')),
                        'price' => isset($item['price']) && $item['price'] !== '' ? (float) $item['price'] : null,
                        'delivery_days' => isset($item['delivery_days']) && $item['delivery_days'] !== '' ? (int) $item['delivery_days'] : null,
                        'revisions' => isset($item['revisions']) && $item['revisions'] !== '' ? (int) $item['revisions'] : null,
                        'scope' => trim((string) ($item['scope'] ?? '')) ?: null,
                        'included' => $included,
                        'how_it_works' => $howItWorks,
                        'not_included' => $notIncluded,
                        'tools_used' => $toolsUsed,
                        'delivery_format' => trim((string) ($item['delivery_format'] ?? '')) ?: null,
                    ];
                })
                ->filter(function ($item) {
                    return $item['package_name']
                        || $item['price'] !== null
                        || $item['delivery_days'] !== null
                        || $item['revisions'] !== null
                        || $item['scope']
                        || !empty($item['included'])
                        || !empty($item['how_it_works'])
                        || !empty($item['not_included'])
                        || !empty($item['tools_used'])
                        || $item['delivery_format'];
                })
                ->values()
                ->all();

            $addOns = collect((array) data_get($validated, 'details.add_ons', []))
                ->map(function ($item) {
                    return [
                        'name' => trim((string) ($item['name'] ?? '')),
                        'price' => isset($item['price']) && $item['price'] !== '' ? (float) $item['price'] : null,
                        'days' => isset($item['days']) && $item['days'] !== '' ? (int) $item['days'] : null,
                    ];
                })
                ->filter(fn($item) => $item['name'] || $item['price'] !== null || $item['days'] !== null)
                ->values()
                ->all();

            if (Schema::hasTable('service_listing_details')) {
                DB::table('service_listing_details')->insert([
                    'listing_id' => $listingId,
                    'product_type' => data_get($validated, 'details.product_type'),
                    'packages_json' => !empty($packages) ? json_encode($packages) : null,
                    'add_ons_json' => !empty($addOns) ? json_encode($addOns) : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $portfolioProjects = $request->input('portfolio_projects', []);
        $hasPortfolioData = false;

        foreach ($portfolioProjects as $projectIndex => $projectInput) {
            $title = trim((string) ($projectInput['title'] ?? ''));
            $description = trim((string) ($projectInput['description'] ?? ''));
            $cost = trim((string) ($projectInput['cost'] ?? ''));
            $files = $request->file("portfolio_projects.$projectIndex.files", []);

            if ($title !== '' || $description !== '' || $cost !== '' || !empty($files)) {
                $hasPortfolioData = true;
                break;
            }
        }

        if (
            $hasPortfolioData &&
            Schema::hasTable('portfolios') &&
            Schema::hasTable('portfolio_projects')
        ) {
            $portfolioId = DB::table('portfolios')->insertGetId([
                'owner_type' => 'listing',
                'owner_id' => $listingId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($portfolioProjects as $projectIndex => $projectInput) {
                $title = trim((string) ($projectInput['title'] ?? ''));
                $description = trim((string) ($projectInput['description'] ?? ''));
                $cost = trim((string) ($projectInput['cost'] ?? ''));
                $sortOrder = isset($projectInput['sort_order']) ? (int) $projectInput['sort_order'] : $projectIndex;
                $files = $request->file("portfolio_projects.$projectIndex.files", []);

                if ($title === '' && $description === '' && $cost === '' && empty($files)) {
                    continue;
                }

                $projectId = DB::table('portfolio_projects')->insertGetId([
                    'portfolio_id' => $portfolioId,
                    'title' => $title ?: null,
                    'description' => $description ?: null,
                    'cost_cents' => $cost !== '' ? $cost : null,
                    'sort_order' => $sortOrder,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                if (Schema::hasTable('portfolio_media')) {
                    // 1. Handle existing media
                    $existingMedia = (array) ($projectInput['existing_media'] ?? []);
                    foreach ($existingMedia as $mIdx => $mPath) {
                        if (empty($mPath)) continue;
                        
                        // Ensure it's a relative path
                        $cleanPath = str_replace(url('storage') . '/', '', $mPath);
                        $cleanPath = str_replace(Storage::disk('public')->url(''), '', $cleanPath);
                        $cleanPath = str_replace('/storage/', '', $cleanPath);

                        if (Storage::disk('public')->exists($cleanPath)) {
                            DB::table('portfolio_media')->insert([
                                'project_id' => $projectId,
                                'path' => $cleanPath,
                                'type' => in_array(strtolower(pathinfo($cleanPath, PATHINFO_EXTENSION)), ['mp4','mov','avi','mkv','webm'], true) ? 'video' : 'image',
                                'sort_order' => $mIdx,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }

                    // 2. Handle new files
                    if (!empty($files)) {
                        $startOrder = count($existingMedia);
                        foreach ($files as $mediaIndex => $mediaFile) {
                            if (!$mediaFile) continue;

                            $mediaPath = $mediaFile->store('portfolio/media', 'public');
                            $mime = $mediaFile->getMimeType();
                            $type = str_starts_with((string) $mime, 'video/') ? 'video' : 'image';

                            DB::table('portfolio_media')->insert([
                                'project_id' => $projectId,
                                'path' => $mediaPath,
                                'type' => $type,
                                'sort_order' => $startOrder + $mediaIndex,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
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

public function updateListing(Request $request, string $username): JsonResponse
{
    $user = $request->user();

    $existing = DB::table('listings')
        ->where('username', $username)
        ->where('user_id', $user->id)
        ->first();

    if (!$existing) {
        return response()->json([
            'success' => false,
            'message' => 'Listing not found.',
        ], 404);
    }

    $validated = $request->validate([
        'listing_type' => 'required|in:course,digital_product,webinar,service',
        'status' => 'nullable|in:draft,published',

        'title' => 'required|string|max:255',
        'category' => 'nullable|string|max:150',
        'sub_category' => 'nullable|string|max:150',
        'short_description' => 'nullable|string',
        'about' => 'nullable|string',
        'prerequisites' => 'nullable|string',

        'ai_powered' => 'nullable|boolean',
        'seller_mode' => 'nullable|in:Solo,Team',
        'team_name' => 'nullable|string|max:255',

        'cover_files' => 'nullable|array',
        'cover_files.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv|max:20480',

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
        'details.price' => 'nullable|numeric|min:0',
        'details.included' => 'nullable|array',
        'details.included.*' => 'nullable|string|max:255',
        'details.delivery_format' => 'nullable|string|max:255',

        'portfolio_projects' => 'nullable|array',
        'portfolio_projects.*.title' => 'nullable|string|max:255',
        'portfolio_projects.*.description' => 'nullable|string',
        'portfolio_projects.*.cost' => 'nullable|string|max:100',
        'portfolio_projects.*.sort_order' => 'nullable|integer|min:0',
        'portfolio_projects.*.files' => 'nullable|array',
        'portfolio_projects.*.files.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv,webm|max:20480',

        'details.course_level' => 'nullable|string|max:100',
        'details.learning_points' => 'nullable|array',
        'details.learning_points.*' => 'nullable|string|max:255',
        'details.languages' => 'nullable|array',
        'details.languages.*' => 'nullable|string|max:100',
        'details.key_outcomes' => 'nullable|array',
        'details.key_outcomes.*' => 'nullable|string|max:100',
        'details.preview_video_file' => 'nullable|file|mimes:mp4,mov,avi,mkv,webm|max:51200',

        'details.lessons' => 'nullable|array',
        'details.lessons.*.title' => 'nullable|string|max:255',
        'details.lessons.*.description' => 'nullable|string',
        'details.lessons.*.media_file' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi,mkv,webm|max:20480',
        'details.lessons.*.media_type' => 'nullable|in:image,video',

        'details.schedule_date' => 'nullable|date',
        'details.schedule_start_time' => 'nullable',
        'details.schedule_duration' => 'nullable|integer|min:1',
        'details.schedule_timezone' => 'nullable|string|max:100',
        'details.webinar_link' => 'nullable|string|max:2048',
        'details.ticket_price' => 'nullable|numeric|min:0',
        'details.agenda' => 'nullable|array',
        'details.agenda.*.time' => 'nullable|string|max:100',
        'details.agenda.*.topic' => 'nullable|string|max:255',
        'details.agenda.*.description' => 'nullable|string',

        // service
        'details.packages' => 'nullable|array',
        'details.packages.*.package_name' => 'nullable|string|max:100',
        'details.packages.*.price' => 'nullable|numeric|min:0',
        'details.packages.*.delivery_days' => 'nullable|integer|min:0',
        'details.packages.*.revisions' => 'nullable|integer|min:0',
        'details.packages.*.scope' => 'nullable|string',
        'details.packages.*.included' => 'nullable|array',
        'details.packages.*.included.*' => 'nullable|string|max:255',
        'details.packages.*.how_it_works' => 'nullable|array',
        'details.packages.*.how_it_works.*' => 'nullable|string|max:255',
        'details.packages.*.not_included' => 'nullable|array',
        'details.packages.*.not_included.*' => 'nullable|string|max:255',
        'details.packages.*.tools_used' => 'nullable|array',
        'details.packages.*.tools_used.*' => 'nullable|string|max:255',
        'details.packages.*.delivery_format' => 'nullable|string|max:255',

        'details.add_ons' => 'nullable|array',
        'details.add_ons.*.name' => 'nullable|string|max:255',
        'details.add_ons.*.price' => 'nullable|numeric|min:0',
        'details.add_ons.*.days' => 'nullable|integer|min:0',
    ]);

    $listing = DB::transaction(function () use ($request, $validated, $existing) {
        $coverPath = $existing->cover_media_path;
        $galleryPaths = $existing->gallery_json ? json_decode($existing->gallery_json, true) : [];

        $existingCoverPaths = [];
        if ($request->has('existing_cover_urls')) {
            foreach ($request->input('existing_cover_urls') as $url) {
                if (empty($url)) continue;
                $path = str_replace(url('storage') . '/', '', $url);
                $path = str_replace(Storage::disk('public')->url(''), '', $path);
                // Also handle relative /storage/ paths if sent
                $path = str_replace('/storage/', '', $path);
                
                if (Storage::disk('public')->exists($path)) {
                    $existingCoverPaths[] = $path;
                }
            }
        }

        $newGallery = [];
        if ($request->hasFile('cover_files')) {
            foreach ($request->file('cover_files') as $file) {
                if ($file) {
                    $newGallery[] = $file->store('listings/covers', 'public');
                }
            }
        }

        // Combine existing and new. Priority to existing if they come first? 
        // Actually, the frontend usually manages the order in the array.
        $galleryPaths = array_merge($existingCoverPaths, $newGallery);
        
        // If we have any gallery images, the first one is the cover_media_path
        if (!empty($galleryPaths)) {
            $coverPath = $galleryPaths[0];
        } else if ($request->hasFile('cover_file')) {
            // Fallback for single file upload if used
            if ($coverPath && Storage::disk('public')->exists($coverPath)) {
                Storage::disk('public')->delete($coverPath);
            }
            $coverPath = $request->file('cover_file')->store('listings/covers', 'public');
            $galleryPaths = [$coverPath];
        }

        $cleanTags = array_values(array_filter(array_map(
            fn($v) => trim((string) $v),
            $validated['tags'] ?? []
        )));

        $cleanTools = array_values(array_filter(array_map(
            fn($v) => trim((string) $v),
            data_get($validated, 'details.tools', [])
        )));

        $listingPrice = null;

        if (($validated['listing_type'] ?? '') === 'digital_product') {
            $listingPrice = data_get($validated, 'details.price');
        } elseif (($validated['listing_type'] ?? '') === 'webinar') {
            $listingPrice = data_get($validated, 'details.ticket_price');
        } elseif (($validated['listing_type'] ?? '') === 'course') {
            $listingPrice = data_get($validated, 'details.price');
        } elseif (($validated['listing_type'] ?? '') === 'service') {
            $packagePrices = collect((array) data_get($validated, 'details.packages', []))
                ->pluck('price')
                ->filter(fn($price) => $price !== null && $price !== '' && (float) $price > 0)
                ->map(fn($price) => (float) $price)
                ->values();

            $listingPrice = $packagePrices->isNotEmpty()
                ? (float) $packagePrices->min()
                : data_get($validated, 'details.price');
        }

        DB::table('listings')
            ->where('id', $existing->id)
            ->update([
                'listing_type' => $validated['listing_type'],
                'title' => $validated['title'],
                'category' => $validated['category'] ?? null,
                'sub_category' => $validated['sub_category'] ?? null,
                'price' => $listingPrice,
                'short_description' => $validated['short_description'] ?? null,
                'about' => $validated['prerequisites'] ?? null,
                'seller_mode' => $validated['seller_mode'] ?? 'Solo',
                'team_name' => $validated['team_name'] ?? null,
                'tags_json' => !empty($cleanTags) ? json_encode($cleanTags) : null,
                'tools_json' => !empty($cleanTools) ? json_encode($cleanTools) : null,
                'ai_powered' => (int) ($validated['ai_powered'] ?? false),
                'cover_media_path' => $coverPath,
                'gallery_json' => !empty($galleryPaths) ? json_encode($galleryPaths) : null,
                'status' => $validated['status'] ?? 'published',
                'updated_at' => now(),
            ]);

        if (Schema::hasTable('listing_faqs')) {
            DB::table('listing_faqs')->where('listing_id', $existing->id)->delete();

            foreach (($validated['faqs'] ?? []) as $index => $faq) {
                $question = trim((string) ($faq['q'] ?? ''));
                $answer = trim((string) ($faq['a'] ?? ''));

                if ($question === '' && $answer === '') continue;

                DB::table('listing_faqs')->insert([
                    'listing_id' => $existing->id,
                    'question' => $question,
                    'answer' => $answer,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        if (Schema::hasTable('listing_links')) {
            DB::table('listing_links')->where('listing_id', $existing->id)->delete();

            foreach (($validated['links'] ?? []) as $index => $link) {
                $value = trim((string) $link);
                if ($value === '') continue;

                DB::table('listing_links')->insert([
                    'listing_id' => $existing->id,
                    'link_url' => $value,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        if (Schema::hasTable('listing_deliverables')) {
            $oldDeliverables = DB::table('listing_deliverables')
                ->where('listing_id', $existing->id)
                ->get(['file_path']);

            foreach ($oldDeliverables as $oldDeliverable) {
                if ($oldDeliverable->file_path && Storage::disk('public')->exists($oldDeliverable->file_path)) {
                    Storage::disk('public')->delete($oldDeliverable->file_path);
                }
            }

            DB::table('listing_deliverables')->where('listing_id', $existing->id)->delete();

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
                    'listing_id' => $existing->id,
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
        }

        if (($validated['listing_type'] ?? '') === 'digital_product' && Schema::hasTable('digital_product_details')) {
            $included = array_values(array_filter(array_map(
                fn ($v) => trim((string) $v),
                data_get($validated, 'details.included', [])
            )));

            DB::table('digital_product_details')->updateOrInsert(
                ['listing_id' => $existing->id],
                [
                    'product_type' => data_get($validated, 'details.product_type'),
                    'price' => data_get($validated, 'details.price'),
                    'included_json' => !empty($included) ? json_encode($included) : null,
                    'delivery_format' => data_get($validated, 'details.delivery_format'),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        if (($validated['listing_type'] ?? '') === 'course') {
            if (Schema::hasTable('course_listing_details')) {
                $learningPoints = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.learning_points', [])
                )));

                $languages = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.languages', [])
                )));

                $includedRaw = data_get($validated, 'details.included', []);
                $included = is_array($includedRaw)
                    ? array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        $includedRaw
                    ), fn($v) => $v !== ''))
                    : [];

                $oldCourseDetails = DB::table('course_listing_details')
                    ->where('listing_id', $existing->id)
                    ->first();

                $previewVideoPath = $oldCourseDetails->preview_video_path ?? null;
                $previewVideoName = $oldCourseDetails->preview_video_name ?? null;
                $previewVideoMime = $oldCourseDetails->preview_video_mime ?? null;
                $previewVideoSize = $oldCourseDetails->preview_video_size ?? null;

                $previewVideo = $request->file('details.preview_video_file');
                if ($previewVideo) {
                    if ($previewVideoPath && Storage::disk('public')->exists($previewVideoPath)) {
                        Storage::disk('public')->delete($previewVideoPath);
                    }

                    $previewVideoPath = $previewVideo->store('listings/course/preview-videos', 'public');
                    $previewVideoName = $previewVideo->getClientOriginalName();
                    $previewVideoMime = $previewVideo->getMimeType();
                    $previewVideoSize = $previewVideo->getSize();
                }

                DB::table('course_listing_details')->updateOrInsert(
                    ['listing_id' => $existing->id],
                    [
                        'course_level' => data_get($validated, 'details.course_level'),
                        'product_type' => data_get($validated, 'details.product_type'),
                        'included_json' => json_encode($included),
                        'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                        'languages_json' => !empty($languages) ? json_encode($languages) : null,
                        'preview_video_mime' => $previewVideoMime,
                        'preview_video_size' => $previewVideoSize,
                        'about_course' => $validated['about'] ?? null,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }

            if (Schema::hasTable('course_listing_lessons')) {
                $oldLessons = DB::table('course_listing_lessons')
                    ->where('listing_id', $existing->id)
                    ->get(['media_path']);

                $newMediaPaths = collect(data_get($validated, 'details.lessons', []))
                    ->pluck('existing_media_path')
                    ->filter()
                    ->all();

                foreach ($oldLessons as $oldLesson) {
                    if ($oldLesson->media_path && !in_array($oldLesson->media_path, $newMediaPaths)) {
                        if (Storage::disk('public')->exists($oldLesson->media_path)) {
                            Storage::disk('public')->delete($oldLesson->media_path);
                        }
                    }
                }

                DB::table('course_listing_lessons')->where('listing_id', $existing->id)->delete();

                foreach ((data_get($validated, 'details.lessons') ?? []) as $index => $lesson) {
                    $title = trim((string) ($lesson['title'] ?? ''));
                    $description = trim((string) ($lesson['description'] ?? ''));
                    $mediaType = $lesson['media_type'] ?? null;
                    $mediaPath = $lesson['existing_media_path'] ?? null;
                    $mediaName = null;
                    $mediaMime = null;
                    $mediaSize = null;

                    $mediaFile = $request->file("details.lessons.$index.media_file");

                    if ($title === '' && $description === '' && !$mediaFile && !$mediaPath) {
                        continue;
                    }

                    if ($mediaFile) {
                        $isVideo = str_starts_with((string) $mediaFile->getMimeType(), 'video/');
                        $mediaFolder = $isVideo ? 'listings/course/lessons/videos' : 'listings/course/lessons/images';

                        $mediaName = $mediaFile->getClientOriginalName();
                        $mediaMime = $mediaFile->getMimeType();
                        $mediaSize = $mediaFile->getSize();
                        $mediaPath = $mediaFile->store($mediaFolder, 'public');

                        if (!$mediaType) {
                            $mediaType = $isVideo ? 'video' : 'image';
                        }
                    } elseif ($mediaPath && !$mediaType) {
                        $ext = strtolower(pathinfo($mediaPath, PATHINFO_EXTENSION));
                        $mediaType = in_array($ext, ['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogg'], true)
                            ? 'video'
                            : 'image';
                    }

                    DB::table('course_listing_lessons')->insert([
                        'listing_id' => $existing->id,
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
        }

        if (($validated['listing_type'] ?? '') === 'webinar') {
            $learningPoints = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.learning_points', [])
            )));

            $languages = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.languages', [])
            )));

            $keyOutcomes = array_values(array_filter(array_map(
                fn($v) => trim((string) $v),
                data_get($validated, 'details.key_outcomes', [])
            )));

            if (Schema::hasTable('webinar_listing_details')) {
                DB::table('webinar_listing_details')->updateOrInsert(
                    ['listing_id' => $existing->id],
                    [
                        'ticket_price' => data_get($validated, 'details.ticket_price'),
                        'product_type' => data_get($validated, 'details.product_type'),
                        'schedule_date' => data_get($validated, 'details.schedule_date'),
                        'schedule_start_time' => data_get($validated, 'details.schedule_start_time'),
                        'schedule_duration' => data_get($validated, 'details.schedule_duration'),
                        'schedule_timezone' => data_get($validated, 'details.schedule_timezone'),
                        'webinar_link' => data_get($validated, 'details.webinar_link'),
                        'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                        'languages_json' => !empty($languages) ? json_encode($languages) : null,
                        'key_outcomes' => !empty($keyOutcomes) ? json_encode($keyOutcomes) : null,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }

            if (Schema::hasTable('webinar_listing_agendas')) {
                DB::table('webinar_listing_agendas')
                    ->where('listing_id', $existing->id)
                    ->delete();

                foreach ((data_get($validated, 'details.agenda') ?? []) as $index => $agendaItem) {
                    $time = trim((string) ($agendaItem['time'] ?? ''));
                    $topic = trim((string) ($agendaItem['topic'] ?? ''));
                    $description = trim((string) ($agendaItem['description'] ?? ''));

                    if ($time === '' && $topic === '' && $description === '') {
                        continue;
                    }

                    DB::table('webinar_listing_agendas')->insert([
                        'listing_id' => $existing->id,
                        'time' => $time ?: null,
                        'topic' => $topic ?: null,
                        'description' => $description ?: null,
                        'sort_order' => $index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        if (($validated['listing_type'] ?? '') === 'service') {
            $packages = collect((array) data_get($validated, 'details.packages', []))
                ->map(function ($item, $index) {
                    $included = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['included'] ?? [])
                    ), fn($v) => $v !== ''));

                    $howItWorks = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['how_it_works'] ?? [])
                    ), fn($v) => $v !== ''));

                    $notIncluded = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['not_included'] ?? [])
                    ), fn($v) => $v !== ''));

                    $toolsUsed = array_values(array_filter(array_map(
                        fn($v) => trim((string) $v),
                        (array) ($item['tools_used'] ?? [])
                    ), fn($v) => $v !== ''));

                    return [
                        'package_name' => trim((string) ($item['package_name'] ?? ['Basic', 'Standard', 'Premium'][$index] ?? 'Package')),
                        'price' => isset($item['price']) && $item['price'] !== '' ? (float) $item['price'] : null,
                        'delivery_days' => isset($item['delivery_days']) && $item['delivery_days'] !== '' ? (int) $item['delivery_days'] : null,
                        'revisions' => isset($item['revisions']) && $item['revisions'] !== '' ? (int) $item['revisions'] : null,
                        'scope' => trim((string) ($item['scope'] ?? '')) ?: null,
                        'included' => $included,
                        'how_it_works' => $howItWorks,
                        'not_included' => $notIncluded,
                        'tools_used' => $toolsUsed,
                        'delivery_format' => trim((string) ($item['delivery_format'] ?? '')) ?: null,
                    ];
                })
                ->filter(function ($item) {
                    return $item['package_name']
                        || $item['price'] !== null
                        || $item['delivery_days'] !== null
                        || $item['revisions'] !== null
                        || $item['scope']
                        || !empty($item['included'])
                        || !empty($item['how_it_works'])
                        || !empty($item['not_included'])
                        || !empty($item['tools_used'])
                        || $item['delivery_format'];
                })
                ->values()
                ->all();

            $addOns = collect((array) data_get($validated, 'details.add_ons', []))
                ->map(function ($item) {
                    return [
                        'name' => trim((string) ($item['name'] ?? '')),
                        'price' => isset($item['price']) && $item['price'] !== '' ? (float) $item['price'] : null,
                        'days' => isset($item['days']) && $item['days'] !== '' ? (int) $item['days'] : null,
                    ];
                })
                ->filter(fn($item) => $item['name'] || $item['price'] !== null || $item['days'] !== null)
                ->values()
                ->all();

            DB::table('service_listing_details')->updateOrInsert(
                ['listing_id' => $existing->id],
                [
                    'product_type' => data_get($validated, 'details.product_type'),
                    'packages_json' => !empty($packages) ? json_encode($packages) : null,
                    'add_ons_json' => !empty($addOns) ? json_encode($addOns) : null,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        if (Schema::hasTable('portfolios') && Schema::hasTable('portfolio_projects')) {
            $portfolio = DB::table('portfolios')
                ->where('owner_type', 'listing')
                ->where('owner_id', $existing->id)
                ->first();

            if ($portfolio) {
                // Instead of deleting everything, we will handle updates per project if possible.
                // But the current UI sends the full list, so deleting and re-inserting is okay 
                // ONLY IF we handle existing media correctly.
                
                // Collect all old project IDs to delete their media later if they are not in the new list
                // For now, let's stick to the delete-and-reinsert pattern but fix the media loss.
                
                // Delete old media files that are NOT in the new existing_media list (optional but good)
                
                DB::table('portfolio_projects')->where('portfolio_id', $portfolio->id)->delete();
            } else {
                $portfolioId = DB::table('portfolios')->insertGetId([
                    'owner_type' => 'listing',
                    'owner_id' => $existing->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $portfolio = (object) ['id' => $portfolioId];
            }

            $portfolioProjects = $request->input('portfolio_projects', []);

            foreach ($portfolioProjects as $projectIndex => $projectInput) {
                $title = trim((string) ($projectInput['title'] ?? ''));
                $description = trim((string) ($projectInput['description'] ?? ''));
                $cost = trim((string) ($projectInput['cost'] ?? ''));
                $sortOrder = isset($projectInput['sort_order']) ? (int) $projectInput['sort_order'] : $projectIndex;
                $files = $request->file("portfolio_projects.$projectIndex.files", []);

                if ($title === '' && $description === '' && $cost === '' && empty($files)) {
                    continue;
                }

                $projectId = DB::table('portfolio_projects')->insertGetId([
                    'portfolio_id' => $portfolio->id,
                    'title' => $title ?: null,
                    'description' => $description ?: null,
                    'cost_cents' => $cost !== '' ? $cost : null,
                    'sort_order' => $sortOrder,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                if (Schema::hasTable('portfolio_media')) {
                    // 1. Handle existing media
                    $existingMedia = (array) ($projectInput['existing_media'] ?? []);
                    foreach ($existingMedia as $mIdx => $mPath) {
                        if (empty($mPath)) continue;
                        
                        // Ensure it's a relative path
                        $cleanPath = str_replace(url('storage') . '/', '', $mPath);
                        $cleanPath = str_replace(Storage::disk('public')->url(''), '', $cleanPath);
                        $cleanPath = str_replace('/storage/', '', $cleanPath);

                        if (Storage::disk('public')->exists($cleanPath)) {
                            DB::table('portfolio_media')->insert([
                                'project_id' => $projectId,
                                'path' => $cleanPath,
                                'type' => in_array(strtolower(pathinfo($cleanPath, PATHINFO_EXTENSION)), ['mp4','mov','avi','mkv','webm'], true) ? 'video' : 'image',
                                'sort_order' => $mIdx,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }

                    // 2. Handle new files
                    if (!empty($files)) {
                        $startOrder = count($existingMedia);
                        foreach ($files as $mediaIndex => $mediaFile) {
                            if (!$mediaFile) continue;

                            $mediaPath = $mediaFile->store('portfolio/media', 'public');
                            $mime = $mediaFile->getMimeType();
                            $type = str_starts_with((string) $mime, 'video/') ? 'video' : 'image';

                            DB::table('portfolio_media')->insert([
                                'project_id' => $projectId,
                                'path' => $mediaPath,
                                'type' => $type,
                                'sort_order' => $startOrder + $mediaIndex,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }

        return DB::table('listings')->where('id', $existing->id)->first();
    });

    return response()->json([
        'success' => true,
        'message' => 'Listing updated successfully.',
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
                'username',
                'listing_type',
                'status',
                'price',
                // 'views_count',
                'cover_media_path',
                'created_at',
                'updated_at',
            ])
            ->map(function ($l) {
                $l->cover_media_url = $l->cover_media_path ? Storage::disk('public')->url($l->cover_media_path) : null;
                return $l;
            });

        return response()->json([
            'success' => true,
            'listings' => $listings,
        ]);
    }

    private function makeUniqueUsername(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);

        if ($base === '') {
            $base = 'listing';
        }

        $username = $base;
        $counter = 1;

        while (true) {
            $query = DB::table('listings')->where('username', $username);

            if ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            }

            if (!$query->exists()) {
                return $username;
            }

            $username = $base . '-' . $counter;
            $counter++;
        }
    }

    private function getListingFullData(int $listingId): array
    {
        $listing = DB::table('listings')->where('id', $listingId)->first();

        if (! $listing) {
            abort(404, 'Listing not found.');
        }

        $user = User::with('personalInfo')
            ->where('id', $listing->user_id)
            ->first();

        $faqs = Schema::hasTable('listing_faqs')
            ? DB::table('listing_faqs')
                ->where('listing_id', $listingId)
                ->orderBy('sort_order')
                ->get(['id', 'question', 'answer'])
                ->map(fn ($row) => [
                    'id' => $row->id,
                    'question' => $row->question,
                    'answer' => $row->answer,
                    'q' => $row->question,
                    'a' => $row->answer,
                ])
                ->values()
                ->all()
            : [];

        $links = Schema::hasTable('listing_links')
            ? DB::table('listing_links')
                ->where('listing_id', $listingId)
                ->orderBy('sort_order')
                ->pluck('link_url')
                ->values()
                ->all()
            : [];

        $deliverables = Schema::hasTable('listing_deliverables')
            ? DB::table('listing_deliverables')
                ->where('listing_id', $listingId)
                ->orderBy('sort_order')
                ->get([
                    'id',
                    'file_path',
                    'file_name',
                    'file_mime',
                    'file_size',
                    'notes',
                ])
                ->map(fn ($row) => [
                    'id' => $row->id,
                    'file_path' => $row->file_path,
                    'file_name' => $row->file_name,
                    'file_mime' => $row->file_mime,
                    'file_size' => $row->file_size,
                    'file_url' => $row->file_path ? Storage::disk('public')->url($row->file_path) : null,
                    'notes' => $row->notes,
                ])
                ->values()
                ->all()
            : [];

        $details = [];
        $tags = [];
        $tools = [];
        // $packagesForResponse = [];
        // $deliveryFormatsForResponse = [];

        if (! empty($listing->tags_json)) {
            $decodedTags = json_decode($listing->tags_json, true);
            $tags = is_array($decodedTags) ? array_values($decodedTags) : [];
        }

        if (! empty($listing->tools_json)) {
            $decodedTools = json_decode($listing->tools_json, true);
            $tools = is_array($decodedTools) ? array_values($decodedTools) : [];
        }

        if (! empty($tools)) {
            $details['tools'] = $tools;
        }

        // =========================
        // DIGITAL PRODUCT
        // =========================
        if ($listing->listing_type === 'digital_product') {
            $productDetails = null;

            if (Schema::hasTable('digital_product_details')) {
                $productDetails = DB::table('digital_product_details')
                    ->where('listing_id', $listingId)
                    ->first();
            }

            if ($productDetails) {
                $included = json_decode($productDetails->included_json ?? '[]', true);

                $details['product_type'] = $productDetails->product_type;
                $details['price'] = $productDetails->price;
                $details['included'] = is_array($included) ? array_values($included) : [];
                $details['delivery_format'] = $productDetails->delivery_format;
            }
        }

        // =========================
        // COURSE
        // =========================
        if ($listing->listing_type === 'course') {
            $courseDetails = null;

            if (Schema::hasTable('course_listing_details')) {
                $courseDetails = DB::table('course_listing_details')
                    ->where('listing_id', $listingId)
                    ->first();
            }

            if ($courseDetails) {
                $learningPoints = json_decode($courseDetails->learning_points_json ?? '[]', true);
                $languages = json_decode($courseDetails->languages_json ?? '[]', true);
                $included = json_decode($courseDetails->included_json ?? '[]', true);

                $details['course_level'] = $courseDetails->course_level;
                $details['product_type'] = $courseDetails->product_type ?? null;
                $details['included'] = is_array($included) ? array_values($included) : [];
                $details['learning_points'] = is_array($learningPoints) ? array_values($learningPoints) : [];
                $details['languages'] = is_array($languages) ? array_values($languages) : [];
                $details['preview_video_path'] = $courseDetails->preview_video_path;
                $details['preview_video_url'] = $courseDetails->preview_video_path
                    ? Storage::disk('public')->url($courseDetails->preview_video_path)
                    : null;
                $details['about_course'] = $courseDetails->about_course ?? null;
            }

            $lessons = Schema::hasTable('course_listing_lessons')
                ? DB::table('course_listing_lessons')
                    ->where('listing_id', $listingId)
                    ->orderBy('sort_order')
                    ->get([
                        'id',
                        'title',
                        'description',
                        'media_type',
                        'media_path',
                        'sort_order',
                    ])
                    ->map(fn ($row) => [
                        'id' => $row->id,
                        'title' => $row->title,
                        'description' => $row->description,
                        'media_type' => $row->media_type,
                        'media_path' => $row->media_path,
                        'media_url' => $row->media_path ? Storage::disk('public')->url($row->media_path) : null,
                        'sort_order' => $row->sort_order,
                    ])
                    ->values()
                    ->all()
                : [];

            $details['lessons'] = $lessons;
        }

        // =========================
        // WEBINAR
        // =========================
        if ($listing->listing_type === 'webinar') {
            $webinarDetails = null;

            if (Schema::hasTable('webinar_listing_details')) {
                $webinarDetails = DB::table('webinar_listing_details')
                    ->where('listing_id', $listingId)
                    ->first();
            }

            if ($webinarDetails) {
                $learningPoints = json_decode($webinarDetails->learning_points_json ?? '[]', true);
                $languages = json_decode($webinarDetails->languages_json ?? '[]', true);
                $keyOutcomes = json_decode($webinarDetails->key_outcomes ?? '[]', true);

                $details['product_type'] = $webinarDetails->product_type ?? null;
                $details['schedule_date'] = $webinarDetails->schedule_date;
                $details['schedule_start_time'] = $webinarDetails->schedule_start_time;
                $details['schedule_duration'] = $webinarDetails->schedule_duration;
                $details['schedule_timezone'] = $webinarDetails->schedule_timezone;
                $details['webinar_link'] = $webinarDetails->webinar_link;
                $details['learning_points'] = is_array($learningPoints) ? array_values($learningPoints) : [];
                $details['languages'] = is_array($languages) ? array_values($languages) : [];
                $details['key_outcomes'] = is_array($keyOutcomes) ? array_values($keyOutcomes) : [];
                $details['ticket_price'] = $webinarDetails->ticket_price;
            }

            $agenda = Schema::hasTable('webinar_listing_agendas')
                ? DB::table('webinar_listing_agendas')
                    ->where('listing_id', $listingId)
                    ->orderBy('sort_order')
                    ->get(['id', 'time', 'topic', 'description', 'sort_order'])
                    ->map(fn ($row) => [
                        'id' => $row->id,
                        'time' => $row->time,
                        'topic' => $row->topic,
                        'description' => $row->description,
                        'sort_order' => $row->sort_order,
                    ])
                    ->values()
                    ->all()
                : [];

            $details['agenda'] = $agenda;
        }

        // =========================
        // SERVICE
        // =========================
        if ($listing->listing_type === 'service') {
            $serviceDetails = null;

            if (Schema::hasTable('service_listing_details')) {
                $serviceDetails = DB::table('service_listing_details')
                    ->where('listing_id', $listingId)
                    ->first();
            }

            if ($serviceDetails) {
                $packages = json_decode($serviceDetails->packages_json ?? '[]', true);
                $addOns = json_decode($serviceDetails->add_ons_json ?? '[]', true);

                $details['product_type'] = $serviceDetails->product_type ?? null;
                $details['packages'] = is_array($packages) ? array_values($packages) : [];
                $details['add_ons'] = is_array($addOns) ? array_values($addOns) : [];
            }
        }

        // =========================
        // LISTING PORTFOLIO ONLY
        // =========================
        $portfolioProjects = [];
        if (Schema::hasTable('portfolios') && Schema::hasTable('portfolio_projects')) {
            $portfolio = DB::table('portfolios')
                ->where('owner_type', 'listing')
                ->where('owner_id', $listing->id)
                ->first();

            if ($portfolio) {
                $projectRows = DB::table('portfolio_projects')
                    ->where('portfolio_id', $portfolio->id)
                    ->orderBy('sort_order')
                    ->get([
                        'id',
                        'title',
                        'description',
                        'cost_cents',
                        'sort_order',
                    ]);

                $portfolioProjects = $projectRows->map(function ($project) {
                    $mediaRows = Schema::hasTable('portfolio_media')
                        ? DB::table('portfolio_media')
                            ->where('project_id', $project->id)
                            ->orderBy('sort_order')
                            ->get(['id', 'path', 'type', 'sort_order'])
                        : collect();

                    $cover = $mediaRows->first();

                    return [
                        'id' => $project->id,
                        'title' => $project->title,
                        'description' => $project->description,
                        'cost_cents' => $project->cost_cents,
                        'sort_order' => $project->sort_order,
                        'cover_media' => $cover ? [
                            'id' => $cover->id,
                            'path' => $cover->path,
                            'url' => $cover->path ? Storage::disk('public')->url($cover->path) : null,
                            'type' => $cover->type,
                        ] : null,
                        'media' => $mediaRows->map(fn ($m) => [
                            'id' => $m->id,
                            'path' => $m->path,
                            'url' => $m->path ? Storage::disk('public')->url($m->path) : null,
                            'type' => $m->type,
                            'sort_order' => $m->sort_order,
                        ])->values()->all(),
                    ];
                })->values()->all();
            }
        }

        // =========================
        // RECOMMENDED LISTINGS
        // =========================
        $recommendedListings = DB::table('listings')
            ->join('users', 'users.id', '=', 'listings.user_id')
            ->where('listings.status', 'published')
            ->where('listings.id', '!=', $listing->id)
            ->inRandomOrder()
            ->limit(8)
            ->get([
                'listings.id',
                'listings.title',
                'listings.price',
                'listings.username as listing_username',
                'listings.listing_type',
                'listings.cover_media_path',
                'users.username as creator_username',
            ])
            ->map(fn ($row) => [
                'id' => $row->id,
                'title' => $row->title,
                'listing_username' => $row->listing_username,
                'listing_type' => $row->listing_type,
                'price' => $row->price,
                'cover_media_path' => $row->cover_media_path,
                'cover_media_url' => $row->cover_media_path ? Storage::disk('public')->url($row->cover_media_path) : null,
                'creator_username' => $row->creator_username,
            ])
            ->values()
            ->all();

        // =========================
        // MORE FROM SAME USER
        // =========================
        $moreFromUser = DB::table('listings')
            ->join('users', 'users.id', '=', 'listings.user_id')
            ->where('listings.user_id', $listing->user_id)
            ->where('listings.status', 'published')
            ->where('listings.id', '!=', $listing->id)
            ->orderByDesc('listings.id')
            ->limit(8)
            ->get([
                'listings.id',
                'listings.title',
                'listings.username as listing_username',
                'listings.listing_type',
                'listings.price',
                'listings.cover_media_path',
                'users.username as creator_username',
            ])
            ->map(fn ($row) => [
                'id' => $row->id,
                'title' => $row->title,
                'listing_username' => $row->listing_username,
                'listing_type' => $row->listing_type,
                'price' => $row->price,
                'cover_media_path' => $row->cover_media_path,
                'cover_media_url' => $row->cover_media_path ? Storage::disk('public')->url($row->cover_media_path) : null,
                'creator_username' => $row->creator_username,
            ])
            ->values()
            ->all();

        $languages = [];
        $skills = [];

        if ($user && $user->personalInfo) {
            $rawLanguages = $user->personalInfo->languages ?? [];
            $rawSkills = $user->personalInfo->skills ?? [];

            $languages = is_array($rawLanguages)
                ? array_values($rawLanguages)
                : (json_decode((string) $rawLanguages, true) ?: []);

            $skills = is_array($rawSkills)
                ? array_values($rawSkills)
                : (json_decode((string) $rawSkills, true) ?: []);
        }
        
        $creator = $user ? [
            'id' => $user->id,
            'username' => $user->username ?? null,
            'full_name' => $user->full_name ?? null,
            'about' => $user->personalInfo->bio ?? $user->personalInfo->about ?? null,
            'bio' => $user->personalInfo->bio ?? $user->personalInfo->about ?? null,
            'avatar_url' => !empty($user->personalInfo->avatar_path)
                ? Storage::disk('public')->url($user->personalInfo->avatar_path)
                : (!empty($user->personalInfo->avatar_url) ? $user->personalInfo->avatar_url : null),
            'languages' => $languages,
            'skills' => $skills,
            'member_since' => $user->created_at ?? null,
            'created_at' => $user->created_at ?? null,
            'title' => $user->personalInfo->title ?? null,
            'avg_response' => '1 hour',
        ] : null;

        $gallery = null;
        if (!empty($listing->gallery_json)) {
            $decoded = json_decode($listing->gallery_json, true);
            if (is_array($decoded)) {
                $gallery = array_map(function($path) {
                    return Storage::disk('public')->url($path);
                }, $decoded);
            }
        }

        return [
            'id' => $listing->id,
            'user_id' => $listing->user_id,
            'title' => $listing->title,
            'creator_username' => $creator['username'] ?? null,
            'listing_username' => $listing->username ?? null,
            'listing_type' => $listing->listing_type,
            'status' => $listing->status,
            'category' => $listing->category,
            'sub_category' => $listing->sub_category,
            'price' => $listing->price,
            'short_description' => $listing->short_description,
            'about' => $listing->about,
            'seller_mode' => $listing->seller_mode,
            'team_name' => $listing->team_name,
            'ai_powered' => (bool) $listing->ai_powered,
            'cover_media_path' => $listing->cover_media_path,
            'cover_media_url' => $listing->cover_media_path ? Storage::disk('public')->url($listing->cover_media_path) : null,
            'gallery' => $gallery,
            'tags' => $tags,
            'faqs' => $faqs,
            'links' => $links,
            'deliverables' => $deliverables,
            'details' => $details,
            'tools' => $tools,
            // 'delivery_formats' => $deliveryFormatsForResponse,
            // 'packages' => $packagesForResponse,
            'creator' => $creator,
            'portfolio_projects' => $portfolioProjects,
            'recommended_listings' => $recommendedListings,
            'more_from_user' => $moreFromUser,
            'created_at' => $listing->created_at,
            'updated_at' => $listing->updated_at,
        ];
    }

    public function getPublicUserListings(string $username): JsonResponse
    {
        $user = DB::table('users')
            ->where('username', $username)
            ->first(['id', 'username', 'full_name']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $listings = DB::table('listings')
            ->where('user_id', $user->id)
            ->where('status', 'published')
            ->orderByDesc('id')
            ->get([
                'id',
                'user_id',
                'username as listing_username',
                'listing_type',
                'title',
                'category',
                'sub_category',
                'price',
                'short_description',
                'cover_media_path',
                'created_at',
                'updated_at',
            ])
            ->map(function ($row) {
                $price = $row->price !== null ? (float) $row->price : null;
                $priceLabel = $price !== null ? 'Price' : null;

                return [
                    'id' => $row->id,
                    'user_id' => $row->user_id,
                    'title' => $row->title,
                    'username' => $row->listing_username,
                    'listing_username' => $row->listing_username,
                    'listing_type' => $row->listing_type,
                    'category' => $row->category,
                    'sub_category' => $row->sub_category,
                    'description' => $row->short_description,
                    'short_description' => $row->short_description,
                    'price' => $price,
                    'price_label' => $priceLabel,
                    'cover_media_path' => $row->cover_media_path,
                    'cover_media_url' => $row->cover_media_path
                        ? Storage::disk('public')->url($row->cover_media_path)
                        : null,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
            ],
            'listings' => $listings,
        ]);
    }

    public function getListingByUsername(Request $request, string $username): JsonResponse
    {
        $user = $request->user();

        $listing = DB::table('listings')
            ->where('user_id', $user->id)
            ->where('username', $username)
            ->first();

        if (!$listing) {
            return response()->json([
                'success' => false,
                'message' => 'Listing not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'listing' => $this->getListingFullData($listing->id),
        ]);
    }

    

    //get my teams
    public function myTeams(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!Schema::hasTable('teams')) {
            return response()->json([
                'success' => true,
                'teams' => [],
            ]);
        }

        $query = DB::table('teams')->where('owner_user_id', $user->id);

        $columns = Schema::getColumnListing('teams');

        $nameColumn = 'team_name';
        if (!in_array('team_name', $columns, true)) {
            if (in_array('name', $columns, true)) {
                $nameColumn = 'name';
            } elseif (in_array('title', $columns, true)) {
                $nameColumn = 'title';
            }
        }

        if (in_array('status', $columns, true)) {
            $query->where('status', 'active');
        }

        $teams = $query
            ->orderByDesc('id')
            ->get([
                'id',
                DB::raw($nameColumn . ' as team_name'),
            ])
            ->map(fn ($row) => [
                'id' => $row->id,
                'team_name' => $row->team_name,
            ])
            ->values();

        return response()->json([
            'success' => true,
            'teams' => $teams,
        ]);
    }

    public function getLanguages(): JsonResponse
    {
        if (!Schema::hasTable('languages')) {
            return response()->json([
                'success' => true,
                'languages' => [],
            ]);
        }

        $columns = Schema::getColumnListing('languages');

        $valueColumn = in_array('value', $columns, true) ? 'value' : 'name';

        $query = DB::table('languages');

        if (in_array('status', $columns, true)) {
            $query->where('status', 'active');
        }

        $languages = $query
            ->orderBy($valueColumn)
            ->get([
                'id',
                DB::raw($valueColumn . ' as value'),
            ])
            ->map(fn ($row) => [
                'id' => $row->id,
                'value' => $row->value,
            ])
            ->values();

        return response()->json([
            'success' => true,
            'languages' => $languages,
        ]);
    }
    
    public function getListingDropdowns(Request $request, string $listingTypeSlug): JsonResponse
    {
        $type = trim((string) $request->query('type', ''));
        $category = trim((string) $request->query('category', ''));
        $subCategory = trim((string) $request->query('sub_category', ''));

        try {
            $listingType = DB::table('listing_types')
                ->where('slug', $listingTypeSlug)
                ->where('is_active', 1)
                ->first();

            if (!$listingType) {
                return response()->json([
                    'success' => false,
                    'message' => 'Listing type not found.',
                ], 404);
            }

            if ($type === 'categories') {
                $categories = DB::table('listing_categories')
                    ->where('listing_type_id', $listingType->id)
                    ->where('is_active', 1)
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->pluck('name')
                    ->filter(fn ($item) => filled($item))
                    ->values();

                return response()->json([
                    'success' => true,
                    'categories' => $categories,
                ]);
            }

            if ($type === 'sub_categories') {
                if ($category === '') {
                    return response()->json([
                        'success' => true,
                        'sub_categories' => [],
                    ]);
                }

                $categoryRow = DB::table('listing_categories')
                    ->where('listing_type_id', $listingType->id)
                    ->where('name', $category)
                    ->where('is_active', 1)
                    ->first();

                if (!$categoryRow) {
                    return response()->json([
                        'success' => true,
                        'sub_categories' => [],
                    ]);
                }

                $subCategories = DB::table('listing_sub_categories')
                    ->where('listing_type_id', $listingType->id)
                    ->where('listing_category_id', $categoryRow->id)
                    ->where('is_active', 1)
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->pluck('name')
                    ->filter(fn ($item) => filled($item))
                    ->values();

                return response()->json([
                    'success' => true,
                    'sub_categories' => $subCategories,
                ]);
            }

            if ($type === 'product_types') {
                if ($category === '' || $subCategory === '') {
                    return response()->json([
                        'success' => true,
                        'product_types' => [],
                    ]);
                }

                $categoryRow = DB::table('listing_categories')
                    ->where('listing_type_id', $listingType->id)
                    ->where('name', $category)
                    ->where('is_active', 1)
                    ->first();

                if (!$categoryRow) {
                    return response()->json([
                        'success' => true,
                        'product_types' => [],
                    ]);
                }

                $subCategoryRow = DB::table('listing_sub_categories')
                    ->where('listing_type_id', $listingType->id)
                    ->where('listing_category_id', $categoryRow->id)
                    ->where('name', $subCategory)
                    ->where('is_active', 1)
                    ->first();

                if (!$subCategoryRow) {
                    return response()->json([
                        'success' => true,
                        'product_types' => [],
                    ]);
                }

                $productTypes = DB::table('listing_product_types')
                    ->where('listing_type_id', $listingType->id)
                    ->where('listing_category_id', $categoryRow->id)
                    ->where('listing_sub_category_id', $subCategoryRow->id)
                    ->where('is_active', 1)
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->pluck('name')
                    ->filter(fn ($item) => filled($item))
                    ->values();

                return response()->json([
                    'success' => true,
                    'product_types' => $productTypes,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid dropdown type.',
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}