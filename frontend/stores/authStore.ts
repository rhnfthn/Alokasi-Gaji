export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

export const useAuthStore = defineStore('auth', () => {
  const accessTokenCookie = useCookie<string | null>('access_token', {
    sameSite: 'lax',
  });

  const user = ref<User | null>(null);
  const avatarBuster = ref(0);
  const accessToken = computed(() => accessTokenCookie.value ?? '');
  const isAuthenticated = computed(() => Boolean(accessTokenCookie.value));

  async function register(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    const { $api } = useNuxtApp();
    const res = await $api<any>('/auth/register', {
      method: 'POST',
      body: payload,
    });

    const token: string | undefined = res?.accessToken ?? res?.access_token;
    if (token) accessTokenCookie.value = token;

    const resUser: User | undefined = res?.user;
    if (resUser) user.value = resUser;
    if (!user.value && accessTokenCookie.value) {
      await fetchProfile();
    }

    return res as { user: User; accessToken: string };
  }

  async function login(payload: { email: string; password: string }) {
    const { $api } = useNuxtApp();
    const res = await $api<any>('/auth/login', {
      method: 'POST',
      body: payload,
    });

    const token: string | undefined = res?.accessToken ?? res?.access_token;
    if (token) accessTokenCookie.value = token;

    const resUser: User | undefined = res?.user;
    if (resUser) user.value = resUser;
    if (!user.value && accessTokenCookie.value) {
      await fetchProfile();
    }

    return res as { user: User; accessToken: string };
  }

  async function logout(redirectTo: string = '/auth/login') {
    accessTokenCookie.value = null;
    user.value = null;
    avatarBuster.value = 0;
    await navigateTo(redirectTo);
  }

  async function fetchProfile() {
    if (!accessTokenCookie.value) return null;
    const { $api } = useNuxtApp();
    const prevAvatar = user.value?.avatar ?? null;
    const me = await $api<User>('/auth/profile');
    user.value = me;
    if ((me.avatar ?? null) !== prevAvatar) {
      avatarBuster.value = Date.now();
    } else if (me.avatar && avatarBuster.value === 0) {
      avatarBuster.value = Date.now();
    }
    return me;
  }

  return {
    user,
    avatarBuster,
    accessToken: accessToken,
    isAuthenticated,
    register,
    login,
    logout,
    fetchProfile,
  };
});
