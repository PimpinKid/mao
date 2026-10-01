const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Fix ad deletion to be a soft delete so we don't lose maker_id for active deals
content = content.replace(
    /await dbRun\('DELETE FROM p2p_ads WHERE id = \? AND maker_id = \?', \[req\.params\.id\]\);/g,
    "await dbRun('UPDATE p2p_ads SET status = ? WHERE id = ? AND maker_id = ?', ['deleted', req.params.id, req.user.id]);"
);
// Also in that endpoint it used req.params.id but missed req.user.id in the array in original code! So soft-delete fixes that too.

// Fix websocket emit for dispute
const disputeLogic = `await dbRun('INSERT INTO p2p_messages (deal_id, sender_id, message, is_system) VALUES (?, ?, ?, 1)', [deal.id, 0, sysMsg]);`;
const disputeFix = `await dbRun('INSERT INTO p2p_messages (deal_id, sender_id, message, is_system) VALUES (?, ?, ?, 1)', [deal.id, 0, sysMsg]);
        io.to('p2p_deal_' + deal.id).emit('chat:message', {
            id: Date.now(), deal_id: deal.id, sender_id: 0, message: sysMsg, is_system: 1, created_at: new Date().toISOString()
        });`;
content = content.replace(disputeLogic, disputeFix);

fs.writeFileSync('server.js', content);
