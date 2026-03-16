<template>
  <div class="min-h-screen bg-white font-display text-gray-900">
    <!-- Navigation -->
    <header class="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-10 w-10 rounded-lg object-cover" />
          <span class="text-lg font-semibold">FinFlow</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex">
          <a href="#features" class="text-sm text-gray-600 hover:text-gray-900">Features</a>
          <a href="#how-it-works" class="text-sm text-gray-600 hover:text-gray-900">How it works</a>
          <a href="#advantages" class="text-sm text-gray-600 hover:text-gray-900">Advantages</a>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block">
            Sign in
          </NuxtLink>
          <NuxtLink to="/auth/register" class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Get started
          </NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="px-6 pb-20 pt-32">
        <div class="mx-auto max-w-6xl">
          <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Personal Finance Management
              </div>
              <h1 class="mb-6 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                Take control of your financial future
              </h1>
              <p class="mb-8 text-lg leading-relaxed text-gray-600">
                Track expenses, manage budgets, and achieve your financial goals with a simple, intuitive platform designed for everyday use.
              </p>
              <div class="flex flex-col gap-3 sm:flex-row">
                <NuxtLink to="/auth/register" class="rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-medium text-white hover:bg-gray-800">
                  Start Now
                </NuxtLink>
                <a href="#features" class="rounded-lg border border-gray-200 bg-white px-6 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Learn more
                </a>
              </div>
            </div>

            <!-- Dashboard Preview SVG Illustration -->
            <div class="relative">
              <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm">
                <div class="rounded-xl bg-white p-6">
                  <!-- Dashboard preview -->
                  <div class="mb-4 flex items-center gap-3">
                    <div class="h-3 w-3 rounded-full bg-red-400"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div class="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <!-- Stats Row -->
                  <div class="mb-6 grid grid-cols-3 gap-3">
                    <div class="rounded-lg bg-gray-50 p-3">
                      <div class="mb-1 h-2 w-12 rounded bg-gray-200"></div>
                      <div class="h-4 w-16 rounded bg-gray-900"></div>
                    </div>
                    <div class="rounded-lg bg-emerald-50 p-3">
                      <div class="mb-1 h-2 w-10 rounded bg-emerald-100"></div>
                      <div class="h-4 w-14 rounded bg-emerald-600"></div>
                    </div>
                    <div class="rounded-lg bg-red-50 p-3">
                      <div class="mb-1 h-2 w-14 rounded bg-red-100"></div>
                      <div class="h-4 w-12 rounded bg-red-500"></div>
                    </div>
                  </div>
                  <!-- Chart preview -->
                  <div class="mb-4 rounded-lg border border-gray-100 bg-white p-4">
                    <div class="mb-3 flex items-center justify-between">
                      <div class="h-3 w-20 rounded bg-gray-200"></div>
                      <div class="h-3 w-12 rounded bg-gray-100"></div>
                    </div>
                    <div class="flex items-end gap-2 h-24">
                      <div class="flex-1 rounded-t bg-gray-200" style="height: 60%"></div>
                      <div class="flex-1 rounded-t bg-gray-200" style="height: 80%"></div>
                      <div class="flex-1 rounded-t bg-emerald-500" style="height: 100%"></div>
                      <div class="flex-1 rounded-t bg-gray-200" style="height: 70%"></div>
                      <div class="flex-1 rounded-t bg-gray-200" style="height: 45%"></div>
                      <div class="flex-1 rounded-t bg-gray-200" style="height: 85%"></div>
                      <div class="flex-1 rounded-t bg-gray-200" style="height: 55%"></div>
                    </div>
                  </div>
                  <!-- Transaction list preview -->
                  <div class="space-y-2">
                    <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                      <div class="h-8 w-8 rounded-lg bg-gray-200"></div>
                      <div class="flex-1">
                        <div class="mb-1 h-2 w-24 rounded bg-gray-300"></div>
                        <div class="h-2 w-16 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-3 w-12 rounded bg-gray-300"></div>
                    </div>
                    <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                      <div class="h-8 w-8 rounded-lg bg-gray-200"></div>
                      <div class="flex-1">
                        <div class="mb-1 h-2 w-20 rounded bg-gray-300"></div>
                        <div class="h-2 w-14 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-3 w-10 rounded bg-emerald-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="border-y border-gray-100 bg-gray-50 py-12">
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div class="text-center">
              <p class="text-3xl font-semibold text-gray-900">Private</p>
              <p class="mt-1 text-sm text-gray-600">Your data stays yours</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-semibold text-gray-900">Simple</p>
              <p class="mt-1 text-sm text-gray-600">Easy to get started</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-semibold text-gray-900">Flexible</p>
              <p class="mt-1 text-sm text-gray-600">Budgets, goals, wallets</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-semibold text-gray-900">Insights</p>
              <p class="mt-1 text-sm text-gray-600">See trends over time</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-20">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mx-auto mb-16 max-w-2xl text-center">
            <h2 class="mb-4 text-3xl font-semibold text-gray-900">Everything you need to manage your finances</h2>
            <p class="text-gray-600">Simple tools that help you track, plan, and grow your wealth without complexity.</p>
          </div>

          <div class="grid gap-8 md:grid-cols-3">
            <div class="rounded-xl border border-gray-100 bg-white p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 class="mb-2 font-semibold text-gray-900">Multiple Wallets</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Manage bank accounts, e-wallets, and cash in one place. See your complete financial picture at a glance.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="mb-2 font-semibold text-gray-900">Smart Analytics</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Understand your spending patterns with clear charts and insights. Make informed decisions about your money.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="mb-2 font-semibold text-gray-900">Budget Planning</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Set monthly budgets for different categories and track your progress. Stay on top of your spending limits.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 class="mb-2 font-semibold text-gray-900">Savings Goals</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Set financial goals and track your progress. Whether it's an emergency fund or vacation, we help you get there.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 class="mb-2 font-semibold text-gray-900">Smart Notifications</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Get alerts when you're approaching budget limits or when bills are due. Never miss an important payment.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="mb-2 font-semibold text-gray-900">Secure & Private</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Your financial data is encrypted and secure. We never share your information with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section id="how-it-works" class="border-t border-gray-100 bg-gray-50 py-20">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mx-auto mb-16 max-w-2xl text-center">
            <h2 class="mb-4 text-3xl font-semibold text-gray-900">Get started in minutes</h2>
            <p class="text-gray-600">Three simple steps to take control of your finances.</p>
          </div>

          <div class="grid gap-8 md:grid-cols-3">
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">1</div>
              <h3 class="mb-2 font-semibold text-gray-900">Create your account</h3>
              <p class="text-sm text-gray-600">Sign up in seconds with just your email. No credit card required.</p>
            </div>
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">2</div>
              <h3 class="mb-2 font-semibold text-gray-900">Add your wallets</h3>
              <p class="text-sm text-gray-600">Set up your bank accounts, e-wallets, and cash holdings in one place.</p>
            </div>
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">3</div>
              <h3 class="mb-2 font-semibold text-gray-900">Start tracking</h3>
              <p class="text-sm text-gray-600">Log transactions, set budgets, and watch your savings grow.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Advantages -->
      <section id="advantages" class="py-20">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mx-auto mb-16 max-w-2xl text-center">
            <h2 class="mb-4 text-3xl font-semibold text-gray-900">Why Choose FinFlow?</h2>
            <p class="text-gray-600">Completely free personal finance management with powerful features.</p>
          </div>

          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900">100% Free Forever</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                No hidden fees, no premium plans, no credit card required. All features are completely free for everyone, forever.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900">Lightning Fast</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Built with modern technology for instant loading and seamless performance. Track your finances without any lag.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900">Bank-Level Security</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Your data is encrypted and protected with industry-standard security protocols. Your privacy is our top priority.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900">Unlimited Everything</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                No limits on wallets, transactions, budgets, or goals. Manage all your finances without any restrictions.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900">Powerful Analytics</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Get detailed insights into your spending patterns with beautiful charts and comprehensive reports.
              </p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                <svg class="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900">Mobile Friendly</h3>
              <p class="text-sm leading-relaxed text-gray-600">
                Works perfectly on any device. Track your expenses on the go with our responsive design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="border-t border-gray-100 bg-gray-50 py-20">
        <div class="mx-auto max-w-6xl px-6 text-center">
          <h2 class="mb-4 text-3xl font-semibold text-gray-900">Ready to take control of your finances?</h2>
          <p class="mx-auto mb-8 max-w-xl text-gray-600">
            Join thousands of users who are already managing their money smarter. Start your journey today.
          </p>
          <div class="flex flex-col justify-center gap-3 sm:flex-row">
            <NuxtLink to="/auth/register" class="rounded-lg bg-gray-900 px-8 py-3 text-sm font-medium text-white hover:bg-gray-800">
              Create free account
            </NuxtLink>
            <NuxtLink to="/auth/login" class="rounded-lg border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Sign in
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 bg-white py-12">
      <div class="mx-auto max-w-6xl px-6">
        <div class="grid gap-8 md:grid-cols-4">
          <div>
            <div class="mb-4 flex items-center gap-2">
              <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-8 w-8 rounded-lg object-cover" />
              <span class="text-lg font-semibold text-gray-900">FinFlow</span>
            </div>
            <p class="text-sm text-gray-600">Simple personal finance management for everyone.</p>
          </div>
          <div>
            <h4 class="mb-4 text-sm font-semibold text-gray-900">Product</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#features" class="hover:text-gray-900">Features</a></li>
              <li><a href="#advantages" class="hover:text-gray-900">Advantages</a></li>
              <li><a href="#" class="hover:text-gray-900">Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 text-sm font-semibold text-gray-900">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">About</a></li>
              <li><a href="#" class="hover:text-gray-900">Blog</a></li>
              <li><a href="#" class="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 text-sm font-semibold text-gray-900">Legal</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Privacy</a></li>
              <li><a href="#" class="hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 FinFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth-full' });
</script>
