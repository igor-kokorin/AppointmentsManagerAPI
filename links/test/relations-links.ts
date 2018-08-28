import { assert } from 'chai';
import { Links, RelationsLinks, RelationsLinksOptions } from '../index';
import { ObjectCreatorTesterFactory } from '../../utilities';
import { getGoodRelationsLinksOptions } from './helpers';
import { URL } from 'url';

describe('RelationsLinks', function () {
    ObjectCreatorTesterFactory(RelationsLinks).inheritsFrom(Links);
    ObjectCreatorTesterFactory(RelationsLinks, getGoodRelationsLinksOptions()).isCreatedSuccessfully();

    describe('creating RelationsLinks with', function () {
        ObjectCreatorTesterFactory(RelationsLinks, getGoodRelationsLinksOptions(), 'id').isAbsent().isNotAString().isEmpty();
        ObjectCreatorTesterFactory(RelationsLinks, getGoodRelationsLinksOptions(), 'relations').isAbsent().isEmpty();
    });

    describe('calling getLinks', function () {
        const testData: Array<{ 
            opts: RelationsLinksOptions,
            result: { [key: string]: string }
        }> = [{
                opts: { url: new URL('http://localhost.com/api/appointments'), id: 'appointment1', relations: new Set(['address', 'contacts']) },
                result: { 
                    address: 'http://localhost.com/api/appointments/appointment1/address',
                    contacts: 'http://localhost.com/api/appointments/appointment1/contacts'
                }
            },
            {
                opts: { url: new URL('http://localhost.com/api/addresses'), id: 'address1', relations: new Set(['appointments']) },
                result: { 
                    appointments: 'http://localhost.com/api/addresses/address1/appointments'
                }
            },
            {
                opts: { url: new URL('http://localhost.com/api/contacts/'), id: 'contact1', relations: new Set(['appointments']) },
                result: { 
                    appointments: 'http://localhost.com/api/contacts/contact1/appointments'
                }
            }
        ];
    
        for (let el of testData) {
            it(`with opts=${JSON.stringify(el.opts, (k, v) => { if (v instanceof Set) return [...v]; else return v; })} returns ${JSON.stringify(el.result)}`, function () {
                assert.deepInclude(new RelationsLinks(el.opts).getLinks(), el.result);
            });
        }
    });
});