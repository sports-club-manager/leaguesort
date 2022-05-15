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

        it('should sort on head to head comparison if the teams have yet to play each other', function() {
            results.push({homeTeam:'A', awayTeam:'B', homeGoals:0, awayGoals:1});
            results.push({homeTeam:'C', awayTeam:'D', homeGoals:1, awayGoals:1});
            results.push({homeTeam:'E', awayTeam:'F', homeGoals:3, awayGoals:0});
            results.push({homeTeam:'G', awayTeam:'C', homeGoals:0, awayGoals:0});
            results.push({homeTeam:'B', awayTeam:'E', homeGoals:0, awayGoals:1});
            results.push({homeTeam:'D', awayTeam:'A', homeGoals:2, awayGoals:0});
            leaguesort.calculateTable(results, table);
            assertOrder(['E', 'D', 'B', 'C', 'G', 'A', 'F']);
        });

        it('should sort on alphanumeric as last resort', function() {
            results.push({homeTeam:'B', awayTeam:'D', homeGoals:1, awayGoals:1});
            results.push({homeTeam:'A', awayTeam:'C', homeGoals:1, awayGoals:1});
            results.push({homeTeam:'A', awayTeam:'B', homeGoals:1, awayGoals:1});
            results.push({homeTeam:'C', awayTeam:'D', homeGoals:1, awayGoals:1});
            results.push({homeTeam:'B', awayTeam:'C', homeGoals:1, awayGoals:1});
            results.push({homeTeam:'A', awayTeam:'D', homeGoals:1, awayGoals:1});
            leaguesort.calculateTable(results, table);
            assertOrder(['A', 'B', 'C', 'D']);
        });

        it('should include games yet to be played', function() {
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0});
            results.push({homeTeam:'Fuz', awayTeam:'Baz'});
            results.push({homeTeam:'Bar', awayTeam:'Baz'});
            results.push({homeTeam:'Foo', awayTeam:'Fuz'});
            leaguesort.calculateTable(results, table);
            assert.equal(table.length, 4);    
            assertOrder(['Foo', 'Baz', 'Fuz', 'Bar']);
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
                return (a.name > b.name ? 1 : -1);
            });
            assertOrder(['Bar', 'Baz', 'Foo', 'Fuz']);
        });

        it('should reverse sort alphabetically only', function() {
            leaguesort.calculateTable(results, table, function(a, b) {
                return (a.name < b.name ? 1 : -1);
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

    // 1.1.0+
    describe('when using a fluid api', function() {
        
        beforeEach(function(done) {
            table = [];
            results = [];
            done();
        });

        it('should not fail with an undefined results array', function() {
            var r;
            assert.doesNotThrow(function() {
                leaguesort.calculateTable(r, table);
            });
        });

        it('should return the table to the caller', function() {
            results.push({homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0});
            var t = leaguesort.calculateTable(results, table);
            assert.equal(t, table);
        });

        it('should work without a starting table', function() {
            results = [{homeTeam:'Foo', awayTeam:'Bar', homeGoals:1, awayGoals:0}];
            var t = leaguesort.calculateTable(results);
            assert.equal(t.length, 2);
            assert.equal(t[0].points, 2);
            assert.equal(t[0].goalsFor, 1);
            assert.equal(t[0].goalsAgainst, 0);
        });
        
    });

});
