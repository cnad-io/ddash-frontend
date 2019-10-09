<?php
header('Content-Type: text/javascript');
?>

window.gameRoomUrl = "<?php echo getenv('GAME_ROOM_REMOTE_ADDR') ?>"
window.waitingRoomUrl = "<?php echo getenv('WAITING_ROOM_REMOTE_ADDR') ?>"