import { readFileSync} from 'fs';
import { prisma } from '../../libs/prisma';

const seedUsers = async () => {
    const usersData = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf8'));

    for (const user of usersData) {
        const company = user.company;
        const address = user.address;
        const geo = address.geo;

        await prisma.user.create({
            data: {
                name: user.name,
                username: user.username,
                email: user.email,
                address: {
                    create: {
                        street: address.street,
                        suite: address.suite,
                        city: address.city,
                        zipcode: address.zipcode,
                        geo: {
                            create: {
                                lat: geo.lat,
                                lng: geo.lng
                            }
                        }
                    }
                },
                phone: user.phone,
                website: user.website,
                company: {
                    create: {
                        name: company.name,
                        catchPhrase: company.catchPhrase,
                        bs: company.bs
                    }
                }
            }
        })


    }
}

export default seedUsers;