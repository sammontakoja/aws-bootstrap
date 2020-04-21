const express = require('express');
const {FinnishSSN} = require('finnish-ssn');
const app = express();

const pickRating = (ssn) => {
    if (ssn === '020268-687L')
        return 'A';
    if (ssn === '050342-807H')
        return 'B';
    return 'C';
};

app.get('/:version/creditrating/:ssn', (req, res) => {
    const handleResponse = () => {
        if (FinnishSSN.validate(req.params.ssn)) {
            const body = JSON.stringify({creditrating: pickRating(req.params.ssn)});
            res.send(body);
        } else {
            res.status(400);
            res.send('');
        }
    };
    if (req.params.version === 'v1') {
        handleResponse();
    } else {
        if (req.params.version === 'v2') {
            if ((req.header('caller-id') !== 'ajv') ||
                (req.header('caller-key') !== 'eW91cmJhc2VhcmViZWxvbmd0b3VzCg==')) {
                res.status(401);
                res.send('');
            } else {
                handleResponse();
            }
        } else {
            res.status(404);
            res.send('');
        }
    }
});

const port = 8080;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
