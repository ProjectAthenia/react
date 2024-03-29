import {api} from '../api'
import Organization from '../../models/organization/organization';
import Business from '../../models/organization/business';
import Location from '../../models/location/location';
import OrganizationManager from '../../models/organization/organization-manager';
import Page from '../../models/page';

export default class OrganizationRequests {

    /**
     * Gets the users initial information, and returns them to
     */
    static async getMyOrganization(organizationId: number) : Promise<Organization> {
        const { data } = await api.get('/organizations/' + organizationId, {
            params: {
                'expand[businesses]': '*',
                'expand[paymentMethods]': '*',
                'expand[subscriptions]': '*',
                'expand[subscriptions.lastRenewalRate]': '*',
                'expand[subscriptions.lastRenewalRate.membershipPlan]': '*',
                'expand[subscriptions.membershipPlanRate]': '*',
                'expand[subscriptions.membershipPlanRate.membershipPlan]': '*',
            }
        });

        return data as Organization
    }

    /**
     * Gets the users business for us
     * @param businessId
     */
    static async getPublicBusiness(businessId: number): Promise<Business> {
        const { data } = await api.get('/businesses/' + businessId, {
            params: {
                'expand[categories]': '*',
                'expand[mainCategory]': '*',
                'expand[featuredImages]': '*',
                'expand[locations]': '*',
                'expand[locations.customLinks]': '*',
            }
        });
        return data as Business;
    }

    /**
     * Gets the users business for us
     * @param businessId
     */
    static async getMyBusiness(businessId: number): Promise<Business> {
        const { data } = await api.get('/businesses/' + businessId, {
            params: {
                'expand[categories]': '*',
                'expand[mainCategory]': '*',
                'expand[featuredImages]': '*',
                'expand[locations]': '*',
                'expand[locations.customLinks]': '*',
                'expand[socialMediaConnections]': '*',
            }
        });
        return data as Business;
    }

    /**
     * Creates a business
     * @param organizationData
     */
    static async createOrganization(organizationData: any): Promise<Organization> {
        const { data } = await api.post('/organizations', organizationData);
        return data as Organization;
    }

    /**
     * Creates a business
     * @param organizationId
     * @param businessData
     */
    static async createBusiness(organizationId: number, businessData: any): Promise<Business> {
        const { data } = await api.post('/organizations/' + organizationId + '/businesses', businessData);
        return data as Business;
    }

    /**
     * Updates a business properly for us
     * @param business
     * @param updateData
     */
    static async updateBusiness(business: Business, updateData: any = null): Promise<Business> {
        updateData = updateData ?? {
            name: business.name,
            categories: business.categories?.filter(category => category.id).map(category => category.id),
            featured_images: business.featured_images?.map((image, index) => (
                {
                    asset_id: image.id,
                    order: index,
                }
            ))
        } as any;

        const { data } = await api.put('/organizations/' + business.organization_id + '/businesses/' + business.id!, updateData);
        return data as Business;
    }

    /**
     * Delete a business properly
     * @param business
     */
    static async deleteBusiness(business: Business): Promise<boolean> {
        await api.delete('/organizations/' + business.organization_id + '/businesses/' + business.id!);
        return true;
    }

    /**
     * Runs the creation promise for a location for us
     * @param businessId
     * @param locationData
     */
    static async createLocation(businessId: number, locationData: any): Promise<Location> {
        const {data} = await api.post('/businesses/' + businessId + '/locations', locationData);
        return data as Location;
    }

    /**
     * Updates a location properly for us
     * @param location
     */
    static async updateLocation(location: Location): Promise<Location> {
        const { data } = await api.put('/businesses/' + location.business_id + '/locations/' + location.id!, {
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state,
            zip: location.zip,
            website: location.website,
            phone: location.phone,
            email: location.email,
            hide_address: location.hide_address,
            logo_asset_id: location.logo_asset_id,
            description: location.description,
            custom_links: location.custom_links?.map((customLink) => {
                const data = {
                    url: customLink.url,
                    label: customLink.label,
                } as any;

                if (customLink.id) {
                    data.id = customLink.id;
                }

                return data;
            }),
        });
        return data as Location;
    }

    /**
     * Delete a location properly
     * @param location
     */
    static async deleteLocation(location: Location): Promise<boolean> {
        await api.delete('/businesses/' + location.business_id + '/locations/' + location.id!);
        return true;
    }

    /**
     * Creates a payment method for us properly
     * @param organizationId
     * @param roleId
     * @param email
     * @param phone
     */
    static async createOrganizationManager(organizationId: number, roleId: number, email: string|null = null, phone: string|null = null): Promise<OrganizationManager> {
        let requestData = {
            role_id: roleId,
        } as any;
        if (email) {
            requestData.email = email;
        }
        if (phone) {
            requestData.phone = phone;
        }
        const { data } = await api.post('/organizations/' + organizationId + '/organization-managers', requestData);
        return data as OrganizationManager;
    }

    /**
     *
     * @param organizationManager
     * @param contactEmail
     */
    static async updateOrganizationManagerContactEmail(organizationManager: OrganizationManager, contactEmail: string): Promise<OrganizationManager> {

        const url ='/organizations/' + organizationManager.organization_id
                + '/organization-managers/' + organizationManager.id!;
        const { data } = await api.put(url, {
            contact_email: contactEmail
        });
        return data as OrganizationManager;
    }

    /**
     * Accepts the invitation for us
     * @param invitationToken
     * @param verificationCode
     */
    static async acceptInvitation(invitationToken: string, verificationCode: string): Promise<OrganizationManager> {
        const { data } = await api.post('/accept-organization-invitation', {
            invitation_token: invitationToken,
            verification_code: verificationCode,
        })
        return data as OrganizationManager;
    }

    /**
     * Deletes an organization manager!
     * @param organizationManager
     */
    static async deleteOrganizationManager(organizationManager: OrganizationManager) : Promise<any> {
        return api.delete('/organizations/' + organizationManager.organization_id +  '/organization-managers/' + organizationManager.id)
    }
}
