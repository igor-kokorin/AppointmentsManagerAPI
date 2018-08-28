export default class TestContactsGenerator {
    public static get NON_EXISTENT_CONTACT_ID() {
        return 'contact_not_exists';
    }

    public static generateGoodContacts(): AppointmentsManager.IContact[] {
        return [
            {
                "id": "contact1",
                "firstName": "Гомер",
                "lastName": "Симпсон",
                "middleName": "Джей",
                "company": "Атомная станция",
                "phoneNumbers": [
                    "+7(999)999-99-01",
                    "+7(999)999-99-01"
                ]
            },
            {
                "id": "contact2",
                "firstName": "Лиза",
                "lastName": "Симпсон",
                "middleName": "",
                "company": "Школа",
                "phoneNumbers": [
                    "+7(999)999-99-02"
                ]
            },
            {
                "id": "contact3",
                "firstName": "Барт",
                "lastName": "Симпсон",
                "middleName": "",
                "company": "Школа",
                "phoneNumbers": [
                    "+7(999)999-99-01"
                ]
            },
            {
                "id": "contact4",
                "firstName": "Мардж",
                "lastName": "Симпсон",
                "middleName": "",
                "company": "Дом",
                "phoneNumbers": [
                    "+7(999)999-99-99",
                    "+7(999)999-45-01"
                ]
            },
            {
                "id": "contact5",
                "firstName": "Мэгги",
                "lastName": "Симпсон",
                "middleName": "",
                "company": "Детский сад",
                "phoneNumbers": []
            }
        ];
    }
}