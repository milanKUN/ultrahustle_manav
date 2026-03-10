<?php

namespace Tests\Feature;

use App\Mail\TeamInvitationMail;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\TeamMembership;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeamTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_creation_succeeds_and_username_is_case_insensitive_unique(): void
    {
        $ownerA = User::factory()->create();
        Sanctum::actingAs($ownerA);

        $response = $this->postJson('/api/v1/teams', [
            'name' => 'My Team',
            'username' => 'MyTeam_01',
            'category' => 'Design',
            'availability' => 'Full-time',
            'hashtags' => ['#one', '#two'],
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'status' => true,
                'message' => 'Team created.',
            ]);

        $this->assertDatabaseHas('teams', [
            'owner_user_id' => $ownerA->id,
            'username' => 'myteam_01',
        ]);

        $ownerB = User::factory()->create();
        Sanctum::actingAs($ownerB);

        $response2 = $this->postJson('/api/v1/teams', [
            'name' => 'Another Team',
            'username' => 'MYTEAM_01',
            'category' => 'Design',
            'availability' => 'Full-time',
        ]);

        $response2
            ->assertStatus(409)
            ->assertJson([
                'status' => false,
                'message' => 'Username already taken.',
            ]);
    }

    public function test_invite_creates_record_and_sends_mail(): void
    {
        Mail::fake();

        $owner = User::factory()->create([
            'full_name' => 'Owner User',
        ]);

        $team = Team::create([
            'owner_user_id' => $owner->id,
            'name' => 'Alpha',
            'username' => 'alpha',
            'category' => 'Development',
            'availability' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],
            'rules' => [],
        ]);

        TeamMembership::create([
            'team_id' => $team->id,
            'user_id' => $owner->id,
            'role' => 'Owner',
            'joined_at' => now(),
        ]);

        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/v1/teams/'.$team->id.'/invites', [
            'email' => 'invitee@example.com',
            'role' => 'Contributor',
            'member_title' => 'Designer',
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'status' => true,
                'message' => 'Invite sent.',
            ]);

        $this->assertDatabaseHas('team_invitations', [
            'team_id' => $team->id,
            'email' => 'invitee@example.com',
            'role' => 'Contributor',
        ]);

        Mail::assertSent(TeamInvitationMail::class, function (TeamInvitationMail $mail) {
            return $mail->teamName === 'Alpha'
                && $mail->inviterName === 'Owner User'
                && $mail->role === 'Contributor'
                && str_contains($mail->inviteLink, 'token=');
        });
    }

    public function test_accept_invite_creates_membership_and_marks_accepted(): void
    {
        $owner = User::factory()->create();
        $invitee = User::factory()->create([
            'email' => 'invitee@example.com',
        ]);

        $team = Team::create([
            'owner_user_id' => $owner->id,
            'name' => 'Beta',
            'username' => 'beta',
            'category' => 'Marketing',
            'availability' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],
            'rules' => [],
        ]);

        $token = 'test-token-123';
        $hash = hash('sha256', $token);

        $invite = TeamInvitation::create([
            'team_id' => $team->id,
            'email' => 'invitee@example.com',
            'invited_user_id' => $invitee->id,
            'invited_by_user_id' => $owner->id,
            'role' => 'Lead',
            'member_title' => 'Team Lead',
            'token_hash' => $hash,
            'expires_at' => now()->addDays(2),
            'send_count' => 1,
            'last_sent_at' => now(),
        ]);

        Sanctum::actingAs($invitee);

        $response = $this->postJson('/api/v1/team-invites/'.$token.'/accept');

        $response
            ->assertOk()
            ->assertJson([
                'status' => true,
                'message' => 'Invite accepted.',
            ]);

        $this->assertDatabaseHas('team_memberships', [
            'team_id' => $team->id,
            'user_id' => $invitee->id,
            'role' => 'Lead',
        ]);

        $this->assertNotNull($invite->fresh()->accepted_at);
    }

    public function test_non_owner_cannot_update_or_invite(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();

        $team = Team::create([
            'owner_user_id' => $owner->id,
            'name' => 'Gamma',
            'username' => 'gamma',
            'category' => 'Content',
            'availability' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],
            'rules' => [],
        ]);

        TeamMembership::create([
            'team_id' => $team->id,
            'user_id' => $owner->id,
            'role' => 'Owner',
            'joined_at' => now(),
        ]);

        Sanctum::actingAs($other);

        $patch = $this->patchJson('/api/v1/teams/'.$team->id, [
            'title' => 'New Title',
        ]);

        $patch->assertStatus(403);

        $invite = $this->postJson('/api/v1/teams/'.$team->id.'/invites', [
            'email' => 'x@example.com',
            'role' => 'Contributor',
        ]);

        $invite->assertStatus(403);
    }
}
