export default class TestAddressesGenerator {
    public static get NOT_EXISTENT_ADDRESS_ID() {
        return 'address_not_exists';
    }

    public static generateGoodAddresses(): AppointmentsManager.IAddress[] {
        return [
            {
                "id": "address1",
                "title": "Название 1",
                "addressLine": "Красноярск, улица Крупской, 9",
                "coordinates": {
                    "latitude": 56.020979,
                    "longtitude": 92.775559
                }
            },
            {
                "id": "address2",
                "title": "Название 2",
                "addressLine": "Красноярск, СНТ Победа, улица Бригада № 3, 4",
                "coordinates": {
                    "latitude": 56.009582,
                    "longtitude": 92.79234
                }
            },
            {
                "id": "address3",
                "title": "Название 3",
                "addressLine": "Красноярск, микрорайон Николаевка, улица Отдыха, 18А",
                "coordinates": {
                    "latitude": 56.007161,
                    "longtitude": 92.805302
                }
            },
            {
                "id": "address4",
                "title": "Название 4",
                "addressLine": "Красноярск, улица Карла Маркса, 201",
                "coordinates": {
                    "latitude": 56.009013,
                    "longtitude": 92.822667
                }
            },
            {
                "id": "address5",
                "title": "Название 5",
                "addressLine": "Красноярск, улица Карла Маркса, 102П",
                "coordinates": {
                    "latitude": 56.010251,
                    "longtitude": 92.861016
                }
            },
            {
                "id": "address6",
                "title": "Название 6",
                "addressLine": "Красноярск, улица Диксона, 10",
                "coordinates": {
                    "latitude": 56.022222,
                    "longtitude": 92.881453
                }
            },
            {
                "id": "address7",
                "title": "Название 7",
                "addressLine": "Красноярск, проспект Мира, 37",
                "coordinates": {
                    "latitude": 56.012164,
                    "longtitude": 92.878147
                }
            },
            {
                "id": "address8",
                "title": "Название 8",
                "addressLine": "Красноярск, улица Перенсона, 5А",
                "coordinates": {
                    "latitude": 56.007821,
                    "longtitude": 92.865858
                }
            },
            {
                "id": "address9",
                "title": "Название 9",
                "addressLine": "Красноярск, Водометный переулок, 2",
                "coordinates": {
                    "latitude": 55.979002,
                    "longtitude": 92.846041
                }
            },
            {
                "id": "address10",
                "title": "Название 10",
                "addressLine": "Красноярск, улица 60 лет Октября, 156/1",
                "coordinates": {
                    "latitude": 55.987059,
                    "longtitude": 92.923575
                }
            }
        ];
    }
}