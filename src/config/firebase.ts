import admin from "firebase-admin";

const serviceAccount = require("./aravagent-d3259-firebase-adminsdk-s2uwd-d4f677630c.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

admin
	.messaging()
	.sendToDevice(
		[
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGYzNzg2MmU2OGVlZTg4ODEzY2U5MCIsImlhdCI6MTY0NTE2NDQ0OSwiZXhwIjoxNjQ1MTY0NTA5fQ.kqrlxD0WgcUFHxZR_b4wikWG-kuz_XVL9-cQ1qM99Ho"
		],
		{
			notification: {
				title: "My Title",
				body: "TEST"
			}
		},
		{
			contentAvailable: true,
			priority: "high",
			timeToLive: 60 * 60 * 24
		}
	)
	.then((result: any) => {
		console.log(result.results);
	});
