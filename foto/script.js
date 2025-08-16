document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA PRO VOUCHERY ---

    // Příklad původních dat pro jeden voucher. Tento objekt zkopíruj a uprav pro každý voucher.
    // {
    //   "tel": "123456789",
    //   "kod": "superheslo",
    //   "soubor": "vouchery/voucher-svatba.pdf",
    //   "typ": "Svatební focení",
    //   "platnost": "24. 8. 2026",
    //   "vzkaz": "Ať vám to klape! Těším se na velký den. :)"
    // }
    // Následně celý tento objekt vložte do Base64 enkodéru.

    const vouchers = [
        "ewogICAgInRlbCI6ICI3Mzk2OTU1NTQiLAogICAgImtvZCI6ICJkYXJlazIwMjUiLAogICAgInNvdWJvciI6ICJ2b3VjaGVyeS92b3VjaGVyLWJhYmkucGRmIiwKICAgICJ0eXAiOiAiZm9jZW7DrSBqZWRub3RsaXZjZS9ww6FydS9za3VwaW55IiwKICAgICJwbGF0bm9zdCI6ICIxNS4gOC4gMjAyNiIsCiAgICAidnprYXoiOiAiU3RhxIzDrSBzZSBkb21sdXZpdDspIgogICAgfQ==",
        "ewogICAgInRlbCI6ICI2MDM4NjA5NzMiLAogICAgImtvZCI6ICJkYXJlazIwMjUiLAogICAgInNvdWJvciI6ICJ2b3VjaGVyeS92b3VjaGVyLW1hbWkucGRmIiwKICAgICJ0eXAiOiAiZm9jZW7DrSBqZWRub3RsaXZjZS9ww6FydS9za3VwaW55IiwKICAgICJwbGF0bm9zdCI6ICIxNS4gOC4gMjAyNiIsCiAgICAidnprYXoiOiAiU3RhxI3DrSBzZSBkb21sdXZpdDspIgogICAgfQ==",
        "ewogICAgInRlbCI6ICI3MzIxNTAyODEiLAogICAgImtvZCI6ICJkYXJlazIwMjUiLAogICAgInNvdWJvciI6ICJ2b3VjaGVyeS92b3VjaGVyLXRldGEucGRmIiwKICAgICJ0eXAiOiAiZm9jZW7DrSBqZWRub3RsaXZjZS9ww6FydS9za3VwaW55IiwKICAgICJwbGF0bm9zdCI6ICIxNS4gOC4gMjAyNiIsCiAgICAidnprYXoiOiAiU3RhxI3DrSBzZSBkb21sdXZpdDspIgogICAgfQ=="
    ];

    const voucherForm = document.getElementById('voucher-form');
    const voucherDetailsWrapper = document.getElementById('voucher-details');

    voucherForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const telInput = document.getElementById('tel').value;
        const kodInput = document.getElementById('kod').value;
        let foundVoucher = null;

        for (const encodedVoucher of vouchers) {
            try {
                const decodedData = JSON.parse(atob(encodedVoucher));
                if (decodedData.tel === telInput && decodedData.kod === kodInput) {
                    foundVoucher = decodedData;
                    break;
                }
            } catch (e) {
                console.error("Chyba při dekódování voucheru:", e);
            }
        }

        if (foundVoucher) {
            // Vyplníme data do HTML
            document.getElementById('voucher-type').textContent = foundVoucher.typ;
            document.getElementById('voucher-validity').textContent = foundVoucher.platnost;
            document.getElementById('voucher-message').textContent = foundVoucher.vzkaz;
            document.getElementById('download-link').href = foundVoucher.soubor;
            
            // Zobrazíme sekci s detaily
            voucherDetailsWrapper.style.display = 'block';
        } else {
            alert('Neplatné údaje. Zkontrolujte prosím telefonní číslo a kód.');
            voucherDetailsWrapper.style.display = 'none';
        }
    });
});