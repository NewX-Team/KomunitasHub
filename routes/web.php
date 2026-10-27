<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/dashboard', 'dashboard')->name('dashboard');

Route::inertia('/gabung-komunitas', 'onboarding/join')->name('onboarding.join');
Route::inertia('/lengkapi-profil', 'onboarding/profile')->name('onboarding.profile');
Route::inertia('/menunggu-verifikasi', 'onboarding/pending')->name('onboarding.pending');

require __DIR__.'/settings.php';
