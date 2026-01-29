<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::create([
            'title' => 'Welcome to Laravel Showcase!',
            'content' => "Here's your first post! This is a simple blog application built with Laravel and Vue.js. Feel free to create more posts and explore the features.",
        ]);
    }
}
