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

    describe('with standard comparators', function() {

        beforeEach(function(done) {
            results = [];
            table = [];
            done();
        });

        it('should sort Foo higher than Bar in table with 2 entries', function() {
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0});
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Bar']);
            assert.equal(table.length, 2);    
        });    

        it('should allocate points correctly', function() {
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0});
            leaguesort.calculateTable(results, table);
            assert.equal(table[0].points, 3);    
            assert.equal(table[1].points, 0);    
        });    

        it('should sort Foo > Baz > Fuz > Bar', function() {
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Fuz', homeGoals:1, awayGoals:0});
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Baz', 'Fuz', 'Bar'])
        });

        it('should sort correctly by goal difference then goals scored', function() {
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'Baz', awayTeam:'Fuz', homeGoals:1, awayGoals:0});
            results.push({homeTeam:'Fuz', awayTeam:'Foo', homeGoals:2, awayGoals:1});
            results.push({homeTeam:'Bar', awayTeam:'Baz', homeGoals:3, awayGoals:2});
            leaguesort.calculateTable(results, table);
            assertOrder(['Foo', 'Baz', 'Fuz', 'Bar']);
        });

        it('should sort on head to head before alphanumeric', function() {
            results.push({homeTeam:'B', awayTeam:'D', homeGoals:2, awayGoals:1});
            results.push({homeTeam:'A', awayTeam:'C', homeGoals:2, awayGoals:1});
            results.push({homeTeam:'A', awayTeam:'B', homeGoals:2, awayGoals:0});
            results.push({homeTeam:'C', awayTeam:'D', homeGoals:0, awayGoals:2});
            results.push({homeTeam:'B', awayTeam:'C', homeGoals:1, awayGoals:2});
            results.push({homeTeam:'A', awayTeam:'D', homeGoals:1, awayGoals:1});
            leaguesort.calculateTable(results, table);
            assertOrder(['A', 'D', 'C', 'B']);
        });

    });

    describe('with custom comparators', function() {

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

    describe('when changing default options', function() {
        
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
