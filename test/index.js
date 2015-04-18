var assert = require('assert');
var leaguesort = require('../index');

describe('CalculateTable', function() {

    var results;
    var table;

    var assertOrder = function(order) {
        for (var i = 0; i < table.length; i++) {
            assert.equal(table[i].name, order[i]);
        }
    };

    describe('Initial table from one result', function() {

        beforeEach(function(done) {
            results = [];
            table = [];
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0});
            done();
        });

        it('should sort Foo higher than Bar in table with 2 entries', function() {
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Bar']);
            assert.equal(table.length, 2);    
        });    

        it('should allocate points correctly', function() {
            leaguesort.calculateTable(results, table);
            assert.equal(table[0].points, 3);    
            assert.equal(table[1].points, 0);    
        });    

    });

    describe('Adding more results', function() {

        before(function(done) {
            table = [];
            done();
        });

        beforeEach(function(done) {
            results = [];
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Fuz', homeGoals:1, awayGoals:0});
            done();
        });

        it('should sort Foo > Baz > Fuz > Bar', function() {
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Baz', 'Fuz', 'Bar'])
        });

        it('should sort correctly by goal difference then goals scored', function() {
            results.push({homeTeam:'Fuz', awayTeam:'Foo', homeGoals:2, awayGoals:1});
            results.push({homeTeam:'Bar', awayTeam:'Baz', homeGoals:3, awayGoals:2});
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Baz', 'Fuz', 'Bar']);
        });

    });

    describe('Custom comparators', function() {

        beforeEach(function(done) {
            table = [];
            results = [];
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Fuz', homeGoals:1, awayGoals:0});
            results.push({homeTeam:'Fuz', awayTeam:'Bar', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Foo', homeGoals:1, awayGoals:4});
            done();
        });

        it('should sort alphabetically only', function() {
            leaguesort.calculateTable(results, table, function(a, b) {
                return (a.name > b.name);
            });
            assertOrder(['Bar', 'Baz', 'Foo', 'Fuz']);
        });

        it('should reverse sort alphabetically only', function() {
            leaguesort.calculateTable(results, table, function(a, b) {
                return (a.name < b.name);
            });
            assertOrder(['Fuz', 'Foo', 'Baz', 'Bar']);
        });

    });

    describe('Changing default options', function() {
        
        beforeEach(function(done) {
            table = [];
            results = [];
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Fuz', homeGoals:1, awayGoals:0});
            done();
        });

        it('should apply 2 points per win', function() {
            leaguesort.options({ winPoints: 2 });
            leaguesort.calculateTable(results, table);
            assert.equal(table[0].points, 2);
        });

    });
});
