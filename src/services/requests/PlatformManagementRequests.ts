import api from '../api';
import Platform from '../../models/platform/platform';
import PlatformGroup from '../../models/platform/platform-group';

export default class PlatformManagementRequests {
    /**
     * Loads a single platform
     * @param platformId
     */
    static async getPlatform(platformId: number): Promise<Platform> {
        try {
            const { data } = await api.get('/platforms/' + platformId);
            return data as Platform;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw { response: { data: { error: 'Platform not found' }, status: 404 } };
            }
            throw error;
        }
    }

    /**
     * Creates a new platform
     * @param platformData
     */
    static async createPlatform(platformData: any): Promise<Platform> {
        const { data } = await api.post('/platforms', platformData);
        return data as Platform;
    }

    /**
     * Updates an existing platform
     * @param platform
     * @param platformData
     */
    static async updatePlatform(platform: Platform, platformData: any): Promise<Platform> {
        const { data } = await api.put('/platforms/' + platform.id, platformData);
        return data as Platform;
    }

    /**
     * Deletes a platform
     * @param platform
     */
    static async deletePlatform(platform: Platform): Promise<boolean> {
        await api.delete('/platforms/' + platform.id);
        return true;
    }

    /**
     * Loads a single platform group
     * @param groupId
     */
    static async getPlatformGroup(groupId: number): Promise<PlatformGroup> {
        try {
            const { data } = await api.get('/platform-groups/' + groupId + '?expand[platforms]=*');
            return data as PlatformGroup;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw { response: { data: { error: 'Platform group not found' }, status: 404 } };
            }
            throw error;
        }
    }

    /**
     * Creates a new platform group
     * @param groupData
     */
    static async createPlatformGroup(groupData: any): Promise<PlatformGroup> {
        const { data } = await api.post('/platform-groups', groupData);
        return data as PlatformGroup;
    }

    /**
     * Updates an existing platform group
     * @param group
     * @param groupData
     */
    static async updatePlatformGroup(group: PlatformGroup, groupData: any): Promise<PlatformGroup> {
        const { data } = await api.put('/platform-groups/' + group.id, groupData);
        return data as PlatformGroup;
    }

    /**
     * Deletes a platform group
     * @param group
     */
    static async deletePlatformGroup(group: PlatformGroup): Promise<boolean> {
        await api.delete('/platform-groups/' + group.id);
        return true;
    }
} 