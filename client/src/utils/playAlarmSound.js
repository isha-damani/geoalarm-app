export function playAlarmSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function beepOnce() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 880;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    beepOnce();
    const intervalId = setInterval(beepOnce, 1000);

    function stop() {
        clearInterval(intervalId);
        audioContext.close();
    }

    return stop;
}