import TestAppointmentsGenerator from './test-appointments-generator';
import TestAddressesGenerator from './test-addresses-generator';
import TestContactsGenerator from './test-contacts-generator';

export default function generateGoodTestData(): AppointmentsManager.TestDataBucket {
    const addresses = TestAddressesGenerator.generateGoodAddresses();
    const contacts = TestContactsGenerator.generateGoodContacts();
    const appointments = 
        TestAppointmentsGenerator
            .generateGoodAppointments({ addresses, contacts });

    return { appointments, addresses, contacts };
}