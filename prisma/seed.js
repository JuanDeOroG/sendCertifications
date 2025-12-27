const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const initialUsers = require('./seeders/initialUsers');
const prisma = new PrismaClient();

async function main() {
	await initialUsers(prisma, bcrypt);
	console.log('Seeder initialUsers ejecutado');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
