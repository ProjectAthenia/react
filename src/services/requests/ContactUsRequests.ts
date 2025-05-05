import api from '../api';

export default class ContactUsRequests {

    /**
     * Submits the general contact form for us
     * @param contactData
     */
    static async submitGeneralContact(contactData: any): Promise<any> {
        const { data } = await api.post('/general-contact ', contactData);

        return data;
    }
}
