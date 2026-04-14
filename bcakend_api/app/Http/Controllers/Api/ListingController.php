<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

            'details.webinar_level' => 'nullable|string|max:100',
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
        ]);

        $username = $this->makeUniqueUsername($validated['title']);

        $listing = DB::transaction(function () use ($request, $user, $validated, $username) {
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
                'username' => $username,
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
            //webinar details
            if (($validated['listing_type'] ?? '') === 'webinar') {
                $learningPoints = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.learning_points', [])
                )));

                $languages = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.languages', [])
                )));

                if (Schema::hasTable('webinar_listing_details')) {
                    DB::table('webinar_listing_details')->insert([
                        'listing_id' => $listingId,
                        'ticket_price' => data_get($validated, 'details.ticket_price'),
                        'webinar_level' => data_get($validated, 'details.webinar_level'),
                        'schedule_date' => data_get($validated, 'details.schedule_date'),
                        'schedule_start_time' => data_get($validated, 'details.schedule_start_time'),
                        'schedule_duration' => data_get($validated, 'details.schedule_duration'),
                        'schedule_timezone' => data_get($validated, 'details.schedule_timezone'),
                        'webinar_link' => data_get($validated, 'details.webinar_link'),
                        'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                        'languages_json' => !empty($languages) ? json_encode($languages) : null,
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
                'username',
                'listing_type',
                'status',
                // 'price',
                // 'views_count',
                'cover_media_path',
                'created_at',
                'updated_at',
            ]);

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

        $user = DB::table('users')
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
        $packagesForResponse = [];
        $deliveryFormatsForResponse = [];

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
                $details['product_type'] = $productDetails->product_type;
            }

            $packages = [];

            if (Schema::hasTable('digital_product_packages')) {
                $packageRows = DB::table('digital_product_packages')
                    ->where('listing_id', $listingId)
                    ->orderBy('id')
                    ->get();

                foreach ($packageRows as $packageRow) {
                    $included = [];
                    $deliveryFormats = [];

                    if (Schema::hasTable('digital_product_package_items')) {
                        $items = DB::table('digital_product_package_items')
                            ->where('package_id', $packageRow->id)
                            ->get();

                        foreach ($items as $item) {
                            $values = json_decode($item->item_value_json ?? '[]', true);
                            $values = is_array($values) ? array_values($values) : [];

                            if ($item->item_type === 'included') {
                                $included = $values;
                            }

                            if ($item->item_type === 'delivery_format') {
                                $deliveryFormats = $values;
                            }
                        }
                    }

                    $packagePayload = [
                        'package_name' => $packageRow->package_name,
                        'price' => $packageRow->price,
                        'description' => $packageRow->description ?? '',
                        'included' => $included,
                        'deliveryFormats' => $deliveryFormats,
                        'delivery_formats' => $deliveryFormats,
                    ];

                    $packages[$packageRow->package_name] = $packagePayload;
                    $packagesForResponse[] = $packagePayload;

                    foreach ($deliveryFormats as $fmt) {
                        if (! in_array($fmt, $deliveryFormatsForResponse, true)) {
                            $deliveryFormatsForResponse[] = $fmt;
                        }
                    }
                }
            }

            $details['packages'] = $packages;
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

                $details['course_level'] = $courseDetails->course_level;
                $details['learning_points'] = is_array($learningPoints) ? array_values($learningPoints) : [];
                $details['languages'] = is_array($languages) ? array_values($languages) : [];
                $details['preview_video_path'] = $courseDetails->preview_video_path;
                $details['preview_video_url'] = $courseDetails->preview_video_path
                    ? Storage::disk('public')->url($courseDetails->preview_video_path)
                    : null;
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

                $details['webinar_level'] = $webinarDetails->webinar_level;
                $details['schedule_date'] = $webinarDetails->schedule_date;
                $details['schedule_start_time'] = $webinarDetails->schedule_start_time;
                $details['schedule_duration'] = $webinarDetails->schedule_duration;
                $details['schedule_timezone'] = $webinarDetails->schedule_timezone;
                $details['webinar_link'] = $webinarDetails->webinar_link;
                $details['learning_points'] = is_array($learningPoints) ? array_values($learningPoints) : [];
                $details['languages'] = is_array($languages) ? array_values($languages) : [];
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
                'listings.cover_media_path',
                'users.username as creator_username',
            ])
            ->map(fn ($row) => [
                'id' => $row->id,
                'title' => $row->title,
                'listing_username' => $row->listing_username,
                'listing_type' => $row->listing_type,
                'cover_media_path' => $row->cover_media_path,
                'cover_media_url' => $row->cover_media_path ? Storage::disk('public')->url($row->cover_media_path) : null,
                'creator_username' => $row->creator_username,
            ])
            ->values()
            ->all();

        $creator = $user ? [
            'id' => $user->id,
            'username' => $user->username ?? null,
            'full_name' => $user->full_name ?? null,
            'bio' => $user->bio ?? null,
            'avatar_url' => ! empty($user->avatar_path)
                ? Storage::disk('public')->url($user->avatar_path)
                : (! empty($user->avatar_url) ? $user->avatar_url : null),
            'title' => null,
            'languages' => [],
            'skills' => [],
            'avg_response' => '1 hour',
        ] : null;

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
            'short_description' => $listing->short_description,
            'about' => $listing->about,
            'seller_mode' => $listing->seller_mode,
            'team_name' => $listing->team_name,
            'ai_powered' => (bool) $listing->ai_powered,
            'cover_media_path' => $listing->cover_media_path,
            'cover_media_url' => $listing->cover_media_path ? Storage::disk('public')->url($listing->cover_media_path) : null,
            'tags' => $tags,
            'faqs' => $faqs,
            'links' => $links,
            'deliverables' => $deliverables,
            'details' => $details,
            'tools' => $tools,
            'delivery_formats' => $deliveryFormatsForResponse,
            'packages' => $packagesForResponse,
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
                'short_description',
                'cover_media_path',
                'created_at',
                'updated_at',
            ])
            ->map(function ($row) {
                $price = null;
                $priceLabel = null;

                // WEBINAR PRICE
                if ($row->listing_type === 'webinar' && Schema::hasTable('webinar_listing_details')) {
                    $webinar = DB::table('webinar_listing_details')
                        ->where('listing_id', $row->id)
                        ->first(['ticket_price']);

                    if ($webinar && $webinar->ticket_price !== null) {
                        $price = (float) $webinar->ticket_price;
                        $priceLabel = 'Ticket price';
                    }
                }

                // DIGITAL PRODUCT PRICE = LOWEST PACKAGE PRICE
                if ($row->listing_type === 'digital_product' && Schema::hasTable('digital_product_packages')) {
                    $minPrice = DB::table('digital_product_packages')
                        ->where('listing_id', $row->id)
                        ->whereNotNull('price')
                        ->min('price');

                    if ($minPrice !== null) {
                        $price = (float) $minPrice;
                        $priceLabel = 'Starting at';
                    }
                }

                // COURSE PRICE
                // Adjust this only if your course table stores the field under a different column name.
                if ($row->listing_type === 'course' && Schema::hasTable('course_listing_details')) {
                    $courseColumns = Schema::getColumnListing('course_listing_details');

                    $coursePriceColumn = null;

                    foreach (['price', 'course_price', 'starting_price'] as $candidate) {
                        if (in_array($candidate, $courseColumns, true)) {
                            $coursePriceColumn = $candidate;
                            break;
                        }
                    }

                    if ($coursePriceColumn) {
                        $course = DB::table('course_listing_details')
                            ->where('listing_id', $row->id)
                            ->first([$coursePriceColumn]);

                        if ($course && $course->{$coursePriceColumn} !== null && $course->{$coursePriceColumn} !== '') {
                            $price = (float) $course->{$coursePriceColumn};
                            $priceLabel = 'Price';
                        }
                    }
                }

                // SERVICE PRICE
                // Adjust this only if your service table name/column differs.
                if ($row->listing_type === 'service' && Schema::hasTable('service_listing_details')) {
                    $serviceColumns = Schema::getColumnListing('service_listing_details');

                    $servicePriceColumn = null;

                    foreach (['price', 'starting_price', 'base_price', 'service_price'] as $candidate) {
                        if (in_array($candidate, $serviceColumns, true)) {
                            $servicePriceColumn = $candidate;
                            break;
                        }
                    }

                    if ($servicePriceColumn) {
                        $service = DB::table('service_listing_details')
                            ->where('listing_id', $row->id)
                            ->first([$servicePriceColumn]);

                        if ($service && $service->{$servicePriceColumn} !== null && $service->{$servicePriceColumn} !== '') {
                            $price = (float) $service->{$servicePriceColumn};
                            $priceLabel = $servicePriceColumn === 'starting_price' ? 'Starting at' : 'Price';
                        }
                    }
                }

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

    public function updateListing(Request $request, string $username): JsonResponse
    {
        $user = $request->user();

        $existing = DB::table('listings')
            ->where('user_id', $user->id)
            ->where('username', $username)
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

            'details.webinar_level' => 'nullable|string|max:100',
            'details.ticket_price' => 'nullable|numeric|min:0',
            'details.schedule_date' => 'nullable|date',
            'details.schedule_start_time' => 'nullable',
            'details.schedule_duration' => 'nullable|integer|min:1',
            'details.schedule_timezone' => 'nullable|string|max:100',
            'details.webinar_link' => 'nullable|string|max:2048',
            'details.agenda' => 'nullable|array',
            'details.agenda.*.time' => 'nullable|string|max:100',
            'details.agenda.*.topic' => 'nullable|string|max:255',
            'details.agenda.*.description' => 'nullable|string',
        ]);

        $listing = DB::transaction(function () use ($request, $user, $validated, $existing) {
            $coverPath = $existing->cover_media_path;

            if ($request->hasFile('cover_file')) {
                if ($coverPath && Storage::disk('public')->exists($coverPath)) {
                    Storage::disk('public')->delete($coverPath);
                }

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

            $newUsername = $existing->username;
            if (($validated['title'] ?? '') !== $existing->title) {
                $newUsername = $this->makeUniqueUsername($validated['title'], $existing->id);
            }

            DB::table('listings')
                ->where('id', $existing->id)
                ->update([
                    'listing_type' => $validated['listing_type'],
                    'title' => $validated['title'],
                    'username' => $newUsername,
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
                    'updated_at' => now(),
                ]);

            DB::table('listing_faqs')->where('listing_id', $existing->id)->delete();
            DB::table('listing_links')->where('listing_id', $existing->id)->delete();
            DB::table('listing_deliverables')->where('listing_id', $existing->id)->delete();

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

            if (Schema::hasTable('digital_product_details')) {
                DB::table('digital_product_details')->where('listing_id', $existing->id)->delete();
            }
            if (Schema::hasTable('digital_product_packages')) {
                $packageIds = DB::table('digital_product_packages')
                    ->where('listing_id', $existing->id)
                    ->pluck('id');

                if ($packageIds->isNotEmpty()) {
                    DB::table('digital_product_package_items')->whereIn('package_id', $packageIds)->delete();
                }

                DB::table('digital_product_packages')->where('listing_id', $existing->id)->delete();
            }

            if (Schema::hasTable('course_listing_details')) {
                DB::table('course_listing_details')->where('listing_id', $existing->id)->delete();
            }
            if (Schema::hasTable('course_listing_lessons')) {
                DB::table('course_listing_lessons')->where('listing_id', $existing->id)->delete();
            }
            if (Schema::hasTable('webinar_listing_details')) {
                DB::table('webinar_listing_details')->where('listing_id', $existing->id)->delete();
            }
            if (Schema::hasTable('webinar_listing_agendas')) {
                DB::table('webinar_listing_agendas')->where('listing_id', $existing->id)->delete();
            }

            if (($validated['listing_type'] ?? '') === 'digital_product') {
                if (Schema::hasTable('digital_product_details')) {
                    DB::table('digital_product_details')->insert([
                        'listing_id' => $existing->id,
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
                        'listing_id' => $existing->id,
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
                    'listing_id' => $existing->id,
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

            if (($validated['listing_type'] ?? '') === 'webinar') {
                $learningPoints = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.learning_points', [])
                )));

                $languages = array_values(array_filter(array_map(
                    fn($v) => trim((string) $v),
                    data_get($validated, 'details.languages', [])
                )));

                if (Schema::hasTable('webinar_listing_details')) {
                    DB::table('webinar_listing_details')->insert([
                        'listing_id' => $existing->id,
                        'ticket_price' => data_get($validated, 'details.ticket_price'),
                        'webinar_level' => data_get($validated, 'details.webinar_level'),
                        'schedule_date' => data_get($validated, 'details.schedule_date'),
                        'schedule_start_time' => data_get($validated, 'details.schedule_start_time'),
                        'schedule_duration' => data_get($validated, 'details.schedule_duration'),
                        'schedule_timezone' => data_get($validated, 'details.schedule_timezone'),
                        'webinar_link' => data_get($validated, 'details.webinar_link'),
                        'learning_points_json' => !empty($learningPoints) ? json_encode($learningPoints) : null,
                        'languages_json' => !empty($languages) ? json_encode($languages) : null,
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

            return DB::table('listings')->where('id', $existing->id)->first();
        });

        return response()->json([
            'success' => true,
            'message' => 'Listing updated successfully.',
            'listing_id' => $listing->id,
            'listing' => $this->getListingFullData($listing->id),
        ]);
    }
}