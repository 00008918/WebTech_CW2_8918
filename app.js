const express = require('express')
const app = express();
const fs = require("fs");


app.set('view engine', 'pug')

// dev process
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.render('home')
})

app.get('/create', (req, res) => {
	res.render('create')
})

app.post('/create', (req, res) => {
	const title = req.body.title;
	const desc = req.body.desc;
	const position = req.body.position;

	if (position.trim() === ""){
		res.render("create", { errorPosition: true })
	}
	else if (title.trim() === ""){
		res.render("create", { errorTitle: true })
	}
	else if (desc.trim() === ""){
		res.render("create", { errorDesc: true })
	}
	
	else{
		fs.readFile("./data/records.json", (err, data) => {
			if(err) throw err
			const records = JSON.parse(data)
			
			records.push({
				id: ID(),
				position: position,
				title: title,
				description: desc
			})

			fs.writeFile("./data/records.json", JSON.stringify(records), err => {
				if(err) throw err
				else{
					res.render("create", { success: true })
				}
			})
		})
	}
})



app.get('/records', (req, res) => {
	fs.readFile("./data/records.json", (err, data) => {
		if(err) throw err

		const records = JSON.parse(data)
		res.render("records", { recordList: records })
	})
	
})



app.get('/records/:id', (req, res) => {
	const id = req.params.id;

	fs.readFile("./data/records.json", (err, data) => {
		if(err) throw err

		const records = JSON.parse(data)
		const record = records.filter(record => record.id === id)[0]

		res.render("detail", { record: record })
	})
	


})

app.get('/:id/delete', (req, res) => {
	
	deleteOne(
	  req.params.id, 
	  () => res.redirect('/records')),
	  () => res.sendStatus(500)
  })

//DELETE function
function deleteOne(id, successCb, errorCb) {
    fs.readFile("./data/records.json", "utf8", (err, data) => {
		if (err) errorCb();
        const records = JSON.parse(data);

        const filtered = records.filter(record => record.id != id) || [];

    fs.writeFile("./data/records.json", JSON.stringify(filtered), err => {
		if (err) errorCb();
		successCb();
      });
    });
  }

app.listen(8000, err => {
	if(err) throw err

	console.log('App is running on port 8000...')
})

var ID = function () {
	return '_' + Math.random().toString(36).substr(2, 9);
  };