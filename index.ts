import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as moment from 'moment';
import * as _ from 'underscore';
import * as Promise from 'bluebird';
import * as expressJwt from 'express-jwt';

export default function createExpressApp(jwtSecret: string): express.Express {
    let app = express();
    
    app.use(express.json());
    
    let authMiddleware = expressJwt({ 
        audience: 'http://appointments-manager-api/',
        issuer: 'http://appointments-manager-issuer/',
        secret: jwtSecret,
        resultProperty: 'token'
    });
    
    app.get('/api/appointments', authMiddleware, (req, res) => {
        let client: MongoClient;
    
        Promise.cast(MongoClient.connect('mongodb://localhost:27017')).then((cl) => {
            let totalCount: number;
            client = cl;
    
            cl
                .db('appointments_manager')
                .collection('appointments')
                .count({})
                .then((result) => totalCount = result);
    
            return cl
                .db('appointments_manager')
                .collection('appointments')
                .find({ 'dateTime': { '$gt': moment().startOf('day').toDate() } })
                .sort({ 'dateTime': 1 })
                .limit(10).toArray().then((result) => {
                    
                    res.status(200).json({
                        'totalResultsCount': totalCount,
                        'currentPageResultsCount': result.length,
                        'links': {
                            'currentPage': '',
                            'firstPage': '',
                            'lastPage': '',
                            'nextPage': ''
                        },
                        'results': result.map((a: any) => {
                            a.id = a._id;
                            _.omit(a, '_id');
                            return a;
                        })
                    });
                });
        }).catch(() => {
            res.end();
        }).finally(() => {
            if (client) {
                client.close();
            }
        });
    });
    
    app.get('/api/appointments/:id', authMiddleware, (req, res) => {
        let client: MongoClient;
    
        Promise.cast(MongoClient.connect('mongodb://localhost:27017')).then((cl) => {
            client = cl;
    
            return cl
                .db('appointments_manager')
                .collection('appointments')
                .findOne({ '_id': req.params.id })
                .then((result) => {
    
                    if (result) {
                        result.id = result._id;
                        result = _.omit(result, '_id');
                        
                        res.status(200).json({
                            'links': {
                                'address': '',
                                'contacts': ''
                            },
                            'result': result
                        });
                    } else {
                        res.status(404).end();
                    }
                });
        }).catch(() => {
            res.end();
        }).finally(() => {
            if (client) {
                client.close();
            }
        });
    });
    
    app.post('/api/appointments', authMiddleware, (req, res) => {
        let client: MongoClient;
    
        Promise.cast(MongoClient.connect('mongodb://localhost:27017')).then((cl) => {
            client = cl;
    
            let appointmentToInsert = _.clone(req.body);
    
            appointmentToInsert._id = req.body.id;
            _.omit(appointmentToInsert, 'id');
    
            return cl
                .db('appointments_manager')
                .collection('appointments')
                .insertOne(appointmentToInsert)
                .then(() => {
                    res.status(201).header('Location', `/api/appointments/${req.body.id}`).json({
                        'links': {
                            'address': '',
                            'contacts': ''
                        },
                        'result': req.body
                    });
                });
        }).catch(() => {
            res.end();
        }).finally(() => {
            if (client) {
                client.close();
            }
        });
    });
    
    app.put('/api/appointments/:id', authMiddleware, (req, res) => {
        let client: MongoClient;
    
        Promise.cast(MongoClient.connect('mongodb://localhost:27017')).then((cl) => {
            client = cl;
            let updatedAppointmentId = req.params.id;
    
            req.body =  _.omit(req.body, 'id');
            req.body = _.omit(req.body, '_id');
    
            return cl
                .db('appointments_manager')
                .collection('appointments')
                .updateOne({ '_id': updatedAppointmentId }, { '$set': req.body })
                .then(() => {
                    res.status(200).header('Location', `/api/appointments/${updatedAppointmentId}`).json({
                        'links': {
                            'address': '',
                            'contacts': ''
                        },
                        'result': (req.body.id = updatedAppointmentId) && req.body
                    });
                });
        }).catch(() => {
            res.end();
        }).finally(() => {
            if (client) {
                client.close();
            }
        });
    });
    
    app.delete('/api/appointments/:id', authMiddleware, (req, res) => {
        let client: MongoClient;
    
        Promise.cast(MongoClient.connect('mongodb://localhost:27017')).then((cl) => {
            client = cl;
            let deletedAppointmentId = req.params.id;
    
            return cl
                .db('appointments_manager')
                .collection('appointments')
                .deleteOne({ '_id': deletedAppointmentId })
                .then((result) => {
                    res.status(204).end();
                });
        }).catch(() => {
            res.end();
        }).finally(() => {
            if (client) {
                client.close();
            }
        });
    });
    
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
          res.status(401).end();
        }
    });

    return app;
}