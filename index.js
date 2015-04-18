
var calculateTable = function(results, table, comparator) {

    var applyResult = function(entry, myGoals, yourGoals) {
        entry.played++;
        entry.won += (myGoals > yourGoals ? 1 : 0);
        entry.drawn += (myGoals === yourGoals ? 1 : 0);
        entry.lost += (myGoals < yourGoals ? 1 : 0);
        entry.goalsFor += myGoals;
        entry.goalsAgainst += yourGoals;
        entry.points += (myGoals > yourGoals ? 3 : (myGoals === yourGoals ? 1 : 0));
        return entry;
    };

    var defaultComparator = function(a, b) {
        // points
        if (a.points > b.points) return -1;
        if (a.points < b.points) return 1;

        // GD
        var aGD = a.goalsFor - a.goalsAgainst;
        var bGD = b.goalsFor - b.goalsAgainst;
        if (aGD > bGD) return -1;
        if (aGD < bGD) return 1;

        // scored
        if (a.goalsFor > b.goalsFor) return -1;
        if (a.goalsFor < b.goalsFor) return 1;

        // wins
        if (a.won > b.won) return -1;
        if (a.won < b.won) return 1;

        // name
        return (a.name < b.name);

    };

    var findEntryInTable = function(name, table) {
        for (var i = 0; i < table.length; i++) {
            if (table[i].name === name) return table[i];
        }

        var entry = {played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0};
        entry.name = name;
        table.push(entry);
        return entry;
    };

    for (var i = 0; i < results.length; i++) {
        var newResult = results[i];
        if ('homeGoals' in newResult) {
            var hg = newResult.homeGoals;
            var ag = newResult.awayGoals;
            var ht = findEntryInTable(newResult.homeTeam, table);
            var at = findEntryInTable(newResult.awayTeam, table);
            applyResult(ht, hg, ag);
            applyResult(at, ag, hg);
        }
    }
    table.sort(comparator ? comparator : defaultComparator);
};

exports.calculateTable = calculateTable;

