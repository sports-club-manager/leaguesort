var assert = require('assert');
var leaguesort = require('../index');

describe('CalculateTable', function() {

    var results;
    var table;

    describe('initial table from one result', function() {

        beforeEach(function(done) {
            results = [];
            table = [];
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0});
            done();
        });

        it('should return two entries from one result', function() {
            leaguesort.calculateTable(results, table);
            assert.equal(table.length, 2);    
        });    

        it('should sort Foo higher than Bar', function() {
            leaguesort.calculateTable(results, table);
            assert.equal(table[0].name, 'Foo');    
            assert.equal(table[1].name, 'Bar');    
        });    

        it('should allocate points correctly', function() {
            leaguesort.calculateTable(results, table);
            assert.equal(table[0].points, 3);    
            assert.equal(table[1].points, 0);    
        });    

    });

    describe('adding more results', function() {

        before(function(done) {
            table = [];
            done();
        });

        beforeEach(function(done) {
            results = [];
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:2, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Fuz', homeGoals:1, awayGoals:0});
            done();
        });

        var assertOrder = function(order) {
            for (var i = 0; i < table.length; i++) {
                assert.equal(table[i].name, order[i]);
            }
        };

        it('should sort Foo > Baz > Fuz > Bar', function() {
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Baz', 'Fuz', 'Bar'])
        });

        it('should add new results to the current table and sort correctly', function() {
            results.push({homeTeam:'Bar', awayTeam:'Baz', homeGoals:2, awayGoals:2});
            results.push({homeTeam:'Fuz', awayTeam:'Foo', homeGoals:1, awayGoals:2});
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Baz', 'Bar', 'Fuz']);
        });


    });
});
