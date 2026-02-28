// Mock Supabase client for local demo mode
// Simulates auth, storage, and database operations without real Supabase

type AuthUser = {
  id: string;
  email: string;
  user_metadata?: { name?: string };
};

type AuthSession = {
  user: AuthUser;
  access_token: string;
};

type MockAuthResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: { message: string };
};

const mockUsers: Map<string, { email: string; password: string; name?: string; id: string }> = new Map();
const mockDocuments: Map<string, any[]> = new Map();
const mockKVStore: Map<string, any> = new Map();

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Pre-create demo user
const DEMO_USER_ID = generateId();
mockUsers.set('demo@hyperlynx.local', {
  email: 'demo@hyperlynx.local',
  password: 'demo',
  name: 'Demo User',
  id: DEMO_USER_ID,
});
mockDocuments.set(DEMO_USER_ID, []);

export function createMockSupabaseClient() {
  // Auto-login as demo user in demo mode
  let currentUser: AuthUser = {
    id: DEMO_USER_ID,
    email: 'demo@hyperlynx.local',
    user_metadata: { name: 'Demo User' },
  };
  let currentToken: string = `mock_token_${DEMO_USER_ID}`;

  return {
    auth: {
      getSession: async () => {
        // Always return demo session in demo mode
        return {
          data: {
            session: {
              user: currentUser,
              access_token: currentToken,
            } as AuthSession,
          },
          error: null,
        };
      },

      signUp: async (options: { email: string; password: string; options?: { data?: { name?: string } } }) => {
        const { email, password } = options;
        const name = options.options?.data?.name;

        if (mockUsers.has(email)) {
          return {
            data: null,
            error: { message: "User already exists" },
          };
        }

        const userId = generateId();
        mockUsers.set(email, { email, password, name, id: userId });

        const user: AuthUser = {
          id: userId,
          email,
          user_metadata: { name },
        };

        currentUser = user;
        currentToken = `mock_token_${userId}`;
        mockDocuments.set(userId, []);

        return {
          data: {
            user,
            session: {
              user,
              access_token: currentToken,
            } as AuthSession,
          },
          error: null,
        };
      },

      signInWithPassword: async (options: { email: string; password: string }) => {
        const { email, password } = options;
        const userRecord = mockUsers.get(email);

        if (!userRecord || userRecord.password !== password) {
          return {
            data: { session: null },
            error: { message: "Invalid credentials" },
          };
        }

        const user: AuthUser = {
          id: userRecord.id,
          email,
          user_metadata: { name: userRecord.name },
        };

        currentUser = user;
        currentToken = `mock_token_${userRecord.id}`;

        return {
          data: {
            session: {
              user,
              access_token: currentToken,
            } as AuthSession,
          },
          error: null,
        };
      },

      getUser: async () => {
        if (currentUser) {
          return { data: { user: currentUser }, error: null };
        }
        return { data: { user: null }, error: { message: "Not authenticated" } };
      },

      signOut: async () => {
        // In demo mode, just log a message but keep user logged in
        console.log('[DEMO MODE] Sign out called but session persists in demo.');
        return { error: null };
      },

      updateUser: async (options: any) => {
        if (!currentUser) {
          return { data: null, error: { message: "Not authenticated" } };
        }
        if (options.email) currentUser.email = options.email;
        if (options.user_metadata?.name) {
          currentUser.user_metadata = currentUser.user_metadata || {};
          currentUser.user_metadata.name = options.user_metadata.name;
        }
        return { data: { user: currentUser }, error: null };
      },

      admin: {
        createUser: async (options: any) => {
          const userId = generateId();
          mockUsers.set(options.email, {
            email: options.email,
            password: options.password || "",
            name: options.user_metadata?.name,
            id: userId,
          });
          return { data: { user: { id: userId, email: options.email } }, error: null };
        },

        updateUserById: async (uid: string, options: any) => {
          for (const [, userRecord] of mockUsers) {
            if (userRecord.id === uid) {
              if (options.email) userRecord.email = options.email;
              if (options.user_metadata?.name) userRecord.name = options.user_metadata.name;
              return {
                data: { user: { id: uid, email: userRecord.email, user_metadata: { name: userRecord.name } } },
                error: null,
              };
            }
          }
          return { data: null, error: { message: "User not found" } };
        },
      },
    },

    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any) => {
          return { data: { path }, error: null };
        },
        download: async (path: string) => {
          return { data: new Blob(), error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `mock://storage/${path}` }, error: null };
        },
        remove: async (paths: string[]) => {
          return { data: paths, error: null };
        },
        list: async () => {
          return { data: [], error: null };
        },
      }),

      listBuckets: async () => {
        return { data: [], error: null };
      },

      createBucket: async (name: string, options: any) => {
        return { data: { name }, error: null };
      },
    },

    from: (table: string) => ({
      select: function() {
        return this;
      },
      insert: async (data: any) => {
        return { data, error: null };
      },
      upsert: async (data: any) => {
        return { data, error: null };
      },
      update: async (data: any) => {
        return this;
      },
      delete: function() {
        return this;
      },
      eq: function() {
        return this;
      },
      in: function() {
        return this;
      },
      like: function() {
        return this;
      },
      maybeSingle: async function() {
        return { data: null, error: null };
      },
    }),
  };
}
