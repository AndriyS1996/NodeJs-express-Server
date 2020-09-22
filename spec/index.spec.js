
const fetch = require('node-fetch');
const fs = require('fs');

describe('Server', () => {
    let server;
    beforeAll(() => {
        server = require('../index');
    });
    afterAll(() => {
        server.close()
    })

    describe('post /register', () => {
        it('receive user data', async () =>  {
            let response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                            "Content-Type": "application/json"
                        },
                body: JSON.stringify({
                    name: "Andriy",
                    email: "lalalalalal@ding.com",
                    password: "1234567",
                })

            });
            expect(response.status).toEqual(200)

        })
    })
})