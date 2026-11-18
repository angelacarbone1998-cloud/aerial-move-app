/* Shared month picker for the three booking views. Dates are civil dates in Italy. */
(() => {
  'use strict';
  const clock = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Rome', year:'numeric', month:'2-digit', day:'2-digit'});
  const monthFormat = new Intl.DateTimeFormat('it-IT', {month:'long', year:'numeric', timeZone:'UTC'});
  const dayFormat = new Intl.DateTimeFormat('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'UTC'});
  const week = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
  function today() {
    const parts = Object.fromEntries(clock.formatToParts(new Date()).map(p => [p.type,p.value]));
    return [parts.year,parts.month,parts.day].join('-');
  }
  const isoDay = d => d.toISOString().slice(0,10);
  const dateUTC = iso => new Date(iso + 'T12:00:00Z');
  function validDate(iso) {
    if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    const d = dateUTC(iso);
    return Number.isFinite(+d) && isoDay(d) === iso;
  }
  function moveMonth(month, offset) {
    const d = dateUTC(month + '-01');
    d.setUTCMonth(d.getUTCMonth() + offset);
    return isoDay(d).slice(0,7);
  }
  function groupSlots(slots, fallback = 'Pilates') {
    const groups = new Map();
    const sorted = Array.from(slots || []).sort((a,b) =>
      String(a.start_time || a.time_slot || '').slice(0,5).localeCompare(String(b.start_time || b.time_slot || '').slice(0,5))
      || String(a.time_slot || '').localeCompare(String(b.time_slot || '')));
    for (const slot of sorted) {
      const name = String(slot.activity || fallback);
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(slot);
    }
    return groups;
  }
  function mount(host, sessions, {onChange, controls, selected = '', month: previousMonth = ''}) {
    const now = today(), firstMonth = now.slice(0,7);
    const days = new Map();
    for (const row of sessions || []) {
      if (!validDate(row.session_date) || row.session_date < now) continue;
      if (!days.has(row.session_date)) days.set(row.session_date, []);
      days.get(row.session_date).push(row);
    }
    const availableDates = [...days.keys()].sort();
    const lastMonth = (availableDates.at(-1) || now).slice(0,7);
    let date = validDate(selected) && selected >= now && selected.slice(0,7) <= lastMonth ? selected : '';
    let month = date.slice(0,7) || (/^\d{4}-\d{2}$/.test(previousMonth) && previousMonth >= firstMonth && previousMonth <= lastMonth ? previousMonth : (availableDates[0] || now).slice(0,7));
    function sync(reason) {
      host.dataset.date = date;
      host.dataset.month = month;
      // Never ask a backend for a date with no published classes.
      onChange(date, days.get(date) || [], reason, days.size);
    }
    function draw() {
      const first = dateUTC(month + '-01');
      const offset = (first.getUTCDay() + 6) % 7; // Monday = 0
      const length = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth()+1, 0)).getUTCDate();
      const cells = [];
      for (let i = 0; i < Math.ceil((offset + length) / 7) * 7; i++) {
        const n = i - offset + 1;
        if (n < 1 || n > length) { cells.push('<td></td>'); continue; }
        const key = month + '-' + String(n).padStart(2,'0'), count = days.get(key)?.length || 0;
        const label = dayFormat.format(dateUTC(key)) + (count ? ', ' + count + (count === 1 ? ' turno in programma' : ' turni in programma') : ', nessun turno');
        cells.push('<td><button type="button" class="am-cal-day'+(count?' has-sessions':'')+'" data-day="'+key+'" aria-controls="'+controls+'" aria-label="'+label+'" aria-pressed="'+(date===key)+'"'+(key===now?' aria-current="date"':'')+(key<now?' disabled':'')+'>'+n+'</button></td>');
      }
      let rows = '';
      for (let i=0; i<cells.length; i+=7) rows += '<tr>'+cells.slice(i,i+7).join('')+'</tr>';
      const titleId = host.id + '-title';
      host.innerHTML = '<fieldset class="am-cal-shell" aria-labelledby="'+titleId+'"><div class="am-cal-bar">'+
        '<span class="am-cal-title" id="'+titleId+'" aria-live="polite">'+monthFormat.format(first)+'</span><div class="am-cal-switch">'+
        '<button type="button" data-step="-1" aria-label="Mese precedente"'+(month<=firstMonth?' disabled':'')+'><span aria-hidden="true">‹</span></button>'+
        '<button type="button" data-step="1" aria-label="Mese successivo"'+(month>=lastMonth?' disabled':'')+'><span aria-hidden="true">›</span></button></div></div>'+
        '<table class="am-cal-table" aria-labelledby="'+titleId+'"><thead><tr>'+week.map(w=>'<th scope="col" abbr="'+w+'">'+w.slice(0,2)+'</th>').join('')+
        '</tr></thead><tbody>'+rows+'</tbody></table><p class="am-cal-key"><span class="am-cal-dot" aria-hidden="true"></span>Giorno con lezioni in programma</p></fieldset>';
    }
    host.onclick = event => {
      const button = event.target.closest('button');
      if (!button || !host.contains(button) || button.matches(':disabled')) return;
      if (button.dataset.step) {
        const next = moveMonth(month, Number(button.dataset.step));
        if (next < firstMonth || next > lastMonth) return;
        const step = button.dataset.step;
        month = next; date = ''; draw(); sync('month');
        const focus = host.querySelector('[data-step="'+step+'"]:not(:disabled)') || host.querySelector('[data-step]:not(:disabled)');
        focus?.focus({preventScroll:true});
      } else if (button.dataset.day) {
        host.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed','false');
        date = button.dataset.day;
        button.setAttribute('aria-pressed','true');
        sync('day');
      }
    };
    draw();
    sync('initial');
  }
  function busy(host, value) {
    const fieldset = host?.querySelector('.am-cal-shell');
    if (fieldset) fieldset.disabled = Boolean(value);
  }
  function reveal(panel) {
    if (panel && window.matchMedia('(max-width: 700px)').matches && panel.getBoundingClientRect().top > window.innerHeight - 100) {
      panel.scrollIntoView({block:'start',behavior:'instant'});
    }
  }
  window.BookingCalendar = Object.freeze({mount, busy, groupSlots, today, reveal});
})();
