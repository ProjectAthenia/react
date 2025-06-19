import BaseModel from './base-model';

export enum AvailableRoles {
    SuperAdmin = 1,
    Administrator = 2,
    BusinessCreator = 3,
    BusinessManager = 4,
    BusinessEditor = 5,
    BusinessViewer = 6
}

export default interface Role extends BaseModel {
    name: string;
    description?: string;
}

export const placeholderRole = (): Role => ({
    name: ''
});

export function getRoleName(id: number): string
{
    switch (id) {
        case AvailableRoles.Administrator:
            return 'Owner';

        case AvailableRoles.BusinessManager:
            return 'Manager';

        default:
            return 'Unknown Role';
    }
}

export function getRoleDescription(roleId: number): string {
    switch (roleId) {
        case AvailableRoles.Administrator:
            return 'Access to Billing, Add/Delete users, location activity results, Edit location details, Post ads';

        case AvailableRoles.BusinessManager:
            return 'Access to location activity results, Edit location details, Post ads';
    }
    return '';
}
