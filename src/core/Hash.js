import argon2 from 'argon2';

const make = async (plainPassword) => await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 4,
    parallelism: 2,
    hashLength: 32
}).then((hash) => hash).catch((error) => error)

const verify = async (hashedPassword, plainPassword) => await argon2.verify(hashedPassword, plainPassword).then(match => match)

export default {
    make,
    verify
}