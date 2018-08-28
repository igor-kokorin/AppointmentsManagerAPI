import { ObjectInstantiationTesterFactory, MethodCallTesterFactory } from '../../utilities';
import { RequestProcessingOptionsGenerator } from './helpers';
import { RequestProcessor, RequestProcessorOptions } from '../index';

describe('RequestProcessor', function () {
    ObjectInstantiationTesterFactory.forInstantiationTest(
        RequestProcessor,
        RequestProcessingOptionsGenerator.forRequestProcessorConstructor()
    ).isCreatedSuccessfully();

    describe('creating RequestProcessor when', function () {
        ObjectInstantiationTesterFactory.forOptionsPropertyTest(
            RequestProcessor,
            RequestProcessingOptionsGenerator.forRequestProcessorConstructor(),
            'requestToQueryOptionsTransformer'
        ).isAbsent();
        
        ObjectInstantiationTesterFactory.forOptionsPropertyTest(
            RequestProcessor,
            RequestProcessingOptionsGenerator.forRequestProcessorConstructor(),
            'query'
        ).isAbsent();

        ObjectInstantiationTesterFactory.forOptionsPropertyTest(
            RequestProcessor,
            RequestProcessingOptionsGenerator.forRequestProcessorConstructor(),
            'responseGenerator'
        ).isAbsent();
    });

    describe('calling process when', function () {
        describe('sad path', function () {
            MethodCallTesterFactory({
                obj: new RequestProcessor(RequestProcessingOptionsGenerator.forRequestProcessorConstructor()),
                methodName: 'process',
                opts: RequestProcessingOptionsGenerator.forRequestProcessorProcess(),
                optName: 'request'
            }).isAbsent();
            
            MethodCallTesterFactory({
                obj: new RequestProcessor(RequestProcessingOptionsGenerator.forRequestProcessorConstructor()),
                methodName: 'process',
                opts: RequestProcessingOptionsGenerator.forRequestProcessorProcess(),
                optName: 'response'
            }).isAbsent();
        });

        describe('happy path', function () {
            let constructorOpts: RequestProcessorOptions;
            
            beforeEach(function () {
                constructorOpts = RequestProcessingOptionsGenerator.forRequestProcessorConstructor();
            });

            describe('query options generated successfully', function () {
                
                
                beforeEach(function () {
                    sinon.stub(constructorOpts.)
                });
    
                describe('query executes successfully', function () {
    
                });
    
                describe('query not executes', function () {
    
                
                });
            });
    
            describe('query options not genearted', function () {
    
            });            
        });

    });
});