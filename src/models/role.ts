import BaseModel from './base-model';

export enum AvailableRoles {
    SuperAdmin = 4,
    BusinessCreator = 7,
    Administrator = 8,
    Manager = 9,
}

export default interface Role extends BaseModel
{}

export function getRoleName(id: number): string
{
    switch (id) {
        case AvailableRoles.Administrator:
            return 'Owner';

        case AvailableRoles.Manager:
            return 'Manager';

        default:
            return 'Unknown Role';
    }
}



export function getRoleDescription(roleId: number): string {
    switch (roleId) {
        case AvailableRoles.Administrator:
            return 'Access to Billing, Add/Delete users, location activity results, Edit location details, Post ads';

        case AvailableRoles.Manager:
            return 'Access to location activity results, Edit location details, Post ads';
    }
    return '';
}
