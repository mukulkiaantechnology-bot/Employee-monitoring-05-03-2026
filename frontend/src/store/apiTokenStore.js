import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashToken } from '../utils/hashToken';
import { generateSecureToken } from '../utils/generateSecureToken';

export const useApiTokenStore = create(
    persist(
        (set, get) => ({
            apiTokens: [
                {
                    id: 'tok_1',
                    name: 'Integration Service',
                    tokenHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // dummy hash
                    last4: 'a1b2',
                    permission: 'read',
                    createdAt: '2026-02-20T10:00:00Z'
                },
                {
                    id: 'tok_2',
                    name: 'CRM Connector',
                    tokenHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // dummy hash
                    last4: 'zyx9',
                    permission: 'write',
                    createdAt: '2026-02-25T14:30:00Z'
                }
            ],
            tempVisibleToken: null,

            // Actions
            createToken: async (name, permission) => {
                const rawToken = await generateSecureToken();
                const hash = await hashToken(rawToken);
                const last4 = rawToken.slice(-4);
                
                const newToken = {
                    id: `tok_${Math.random().toString(36).substr(2, 9)}`,
                    name,
                    tokenHash: hash,
                    last4,
                    permission,
                    createdAt: new Date().toISOString()
                };

                set((state) => ({
                    apiTokens: [...state.apiTokens, newToken],
                    tempVisibleToken: rawToken
                }));

                return rawToken;
            },

            regenerateToken: async (id) => {
                const rawToken = await generateSecureToken();
                const hash = await hashToken(rawToken);
                const last4 = rawToken.slice(-4);

                set((state) => ({
                    apiTokens: state.apiTokens.map(t => 
                        t.id === id 
                        ? { ...t, tokenHash: hash, last4, createdAt: new Date().toISOString() } 
                        : t
                    ),
                    tempVisibleToken: rawToken
                }));

                return rawToken;
            },

            deleteToken: (id) => {
                set((state) => ({
                    apiTokens: state.apiTokens.filter(t => t.id !== id)
                }));
            },

            clearTempToken: () => {
                set({ tempVisibleToken: null });
            }
        }),
        {
            name: 'api-tokens-storage',
            partialize: (state) => ({ apiTokens: state.apiTokens }), // Don't persist tempVisibleToken
        }
    )
);
