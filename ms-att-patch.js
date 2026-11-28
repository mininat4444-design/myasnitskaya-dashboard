// Ручные правки Мясницкой в отчёте «Посещаемость преподавателей» (maramuhta).
// Подключается прослойкой effektivnost.html внутрь копии отчёта на вкладке «Мясницкая».
// Сам отчёт maramuhta не меняется. Правки — по месяцам (id страницы page-<мес>-myasnitskaya).
// День: 0 = Пн … 6 = Вс. Преподаватель — по началу ФИО.
(function () {
  var P = {
    okt: {
      // убрать из сетки «Расписание» (перенесены в замены / убраны)
      remove: [
        [0, '06:30', 'Березкина'], [4, '06:30', 'Березкина'],
        [3, '09:15', 'Обухова'],
        [5, '10:00', 'Иванова'],
        [0, '17:30', 'Колбина'],
        [3, '17:30', 'Пичугина'], [0, '19:00', 'Пичугина'],
        [2, '18:45', 'Подгорнова'],
        [6, '10:30', 'Березкина']            // объединена с Вс 10:15
      ],
      // новые средние: [день, время, преподаватель, среднее, подпись времени]
      set: [
        [6, '10:15', 'Березкина', 8.5, '10:15 / 10:30'],   // (10 + 7) / 2
        [6, '09:00', 'Грачева', 6.7],                       // (5 + 8 + 7) / 3, с 25.10
        [6, '10:00', 'Обухова', 19.5],                      // (20 + 25 + 17 + 16) / 4
        [6, '12:00', 'Зареченская', 10.8],                  // (12 + 8 + 11 + 12) / 4
        [6, '12:30', 'Лычак', 12.7]                         // (14 + 12 + 12) / 3
      ],
      // вернуть в сетку: [день, время, класс, преподаватель, среднее, зал]
      add: [
        [6, '10:30', 'Аштанга йога. Все уровни', 'Барабаш Татьяна', 19.0, 'Юпитер'],   // 25.10
        [2, '18:45', 'Хатха йога. Средний уровень', 'Лисова Виктория', 11.0, 'Сатурн'] // 07.10
      ],
      // убрать из «Мероприятия и замены»: [дата, время, преподаватель]
      zamDel: [
        ['25.10', '10:30', 'Барабаш'], ['25.10', '09:00', 'Грачева'], ['25.10', '12:30', 'Лычак'],
        ['25.10', '12:00', 'Зареченская'], ['25.10', '10:00', 'Обухова'],
        ['07.10', '18:45', 'Лисова']
      ],
      // добавить в «Мероприятия и замены»: [дата, день, время, класс, преподаватель, посетителей]
      zamAdd: [
        ['05.10', 'Пн', '06:30', 'Аштанга утренний майсор. Все уровни (М)', 'Березкина Олеся', 5],
        ['12.10 или 26.10', 'Пн', '06:30', 'Аштанга утренний майсор. Все уровни (М)', 'Березкина Олеся', 7],
        ['09.10', 'Пт', '06:30', 'Аштанга утренний майсор. Все уровни (М)', 'Березкина Олеся', 6],
        ['23.10 или 30.10', 'Пт', '06:30', 'Аштанга утренний майсор. Все уровни (М)', 'Березкина Олеся', 11],
        ['10.10', 'Сб', '10:00', 'Хатха йога. Все уровни (М)', 'Иванова Мария', 9],
        ['17.10', 'Сб', '10:00', 'Хатха йога. Все уровни (М)', 'Иванова Мария', 9],
        ['26.10', 'Пн', '17:30', 'Хатха йога. Все уровни (М)', 'Колбина Анастасия', 3],
        ['01.10', 'Чт', '17:30', 'Аштанга йога. Все уровни (М)', 'Пичугина Мария', 3],
        ['15.10', 'Чт', '17:30', 'Аштанга йога. Все уровни (М)', 'Пичугина Мария', 9],
        ['12.10', 'Пн', '19:00', 'Хатха йога. Все уровни (М)', 'Пичугина Мария', 20],
        ['14.10', 'Ср', '18:45', 'Хатха йога. Средний уровень (М)', 'Подгорнова Юлия', 4],
        ['21.10', 'Ср', '18:45', 'Хатха йога. Средний уровень (М)', 'Подгорнова Юлия', 4],
        ['28.10', 'Ср', '18:45', 'Хатха йога. Средний уровень (М)', 'Подгорнова Юлия', 8]
      ]
    }
  };

  var NORMS = { 'Юпитер': [15, 10, 10, 19, 19], 'Сатурн': [15, 8, 8, 14, 14] };
  function normClass(avg, hall, day, time, cls) {
    var n = NORMS[hall]; if (!n) return 'norm-red';
    var mm = parseInt(time, 10) * 60 + parseInt(time.split(':')[1] || 0, 10);
    var i = /майсор|лэд/i.test(cls) ? 0 : day >= 5 ? 4 : mm < 690 ? 1 : mm < 1080 ? 2 : 3;
    var r = avg / n[i];
    return r > 0.95 ? 'norm-star' : r >= 0.86 ? 'norm-green' : r >= 0.70 ? 'norm-orange' : 'norm-red';
  }
  function txt(el, sel) { var x = el.querySelector(sel); return x ? x.textContent.trim() : ''; }
  function toMin(t) { return parseInt(t, 10) * 60 + parseInt(t.split(':')[1] || 0, 10); }
  function ddmm(s) { var m = /(\d\d)\.(\d\d)/.exec(s); return m ? +m[2] * 100 + +m[1] : 9999; }

  function apply(mon, p) {
    var page = document.getElementById('page-' + mon + '-myasnitskaya');
    if (!page) return;
    var grid = null, zam = null;
    page.querySelectorAll('.card-title').forEach(function (h) {
      if (/Расписание/.test(h.textContent)) grid = h.parentElement;
      if (/Мероприятия и замены/.test(h.textContent)) zam = h.parentElement;
    });
    if (grid) {
      var rows = [].slice.call(grid.querySelectorAll('tr')).filter(function (tr) { return tr.querySelector('td.time-col'); });
      var cells = function (day, time, who) {
        var out = [];
        rows.forEach(function (tr) {
          var td = tr.children[day + 1]; if (!td) return;
          td.querySelectorAll('.schedule-cell-item').forEach(function (c) {
            if (txt(c, '.sc-time-mini').slice(0, 5) === time && txt(c, '.sc-teacher').indexOf(who) === 0) out.push(c);
          });
        });
        return out;
      };
      var paint = function (c, day) {
        var avg = parseFloat(txt(c, '.sc-avg').replace('∅', ''));
        var hall = txt(c, '.sc-room').replace('Зал', '').trim();
        c.className = 'schedule-cell-item ' + normClass(avg, hall, day, txt(c, '.sc-time-mini'), txt(c, '.sc-class'));
      };
      (p.remove || []).forEach(function (x) {
        cells(x[0], x[1], x[2]).forEach(function (c) {
          var td = c.closest('td'); c.remove();
          if (td && !td.querySelector('.schedule-cell-item')) { td.className = 'empty-slot'; td.innerHTML = ''; }
        });
      });
      (p.set || []).forEach(function (x) {
        cells(x[0], x[1], x[2]).forEach(function (c) {
          c.querySelector('.sc-avg').textContent = '∅ ' + x[3].toFixed(1);
          if (x[4]) c.querySelector('.sc-time-mini').textContent = x[4];
          paint(c, x[0]);
        });
      });
      (p.add || []).forEach(function (x) {
        if (cells(x[0], x[1], x[3].split(' ')[0]).length) return;
        var m = toMin(x[1]);
        var tr = rows.filter(function (r) {
          var t = r.querySelector('td.time-col').textContent.match(/\d\d:\d\d/g) || [];
          return t.length === 2 && toMin(t[0]) <= m && m < toMin(t[1]);
        })[0];
        if (!tr) return;
        var td = tr.children[x[0] + 1]; if (!td) return;
        var c = document.createElement('div');
        c.innerHTML = '<div class="sc-time-mini"></div><div class="sc-class"></div><div class="sc-teacher"></div><div class="sc-avg"></div><div class="sc-room"></div>';
        c.querySelector('.sc-time-mini').textContent = x[1];
        c.querySelector('.sc-class').textContent = x[2];
        c.querySelector('.sc-teacher').textContent = x[3];
        c.querySelector('.sc-avg').textContent = '∅ ' + x[4].toFixed(1);
        c.querySelector('.sc-room').textContent = 'Зал ' + x[5];
        if (td.className !== 'has-class') { td.className = 'has-class'; td.innerHTML = ''; }
        td.appendChild(c);
        paint(c, x[0]);
      });
    }
    var tb = zam && zam.querySelector('tbody');
    if (tb) {
      [].slice.call(tb.rows).forEach(function (r) {
        var c = [].map.call(r.cells, function (td) { return td.textContent.trim(); });
        (p.zamDel || []).forEach(function (x) {
          if (c[0] === x[0] && c[2] === x[1] && c[4].indexOf(x[2]) === 0) r.remove();
        });
      });
      (p.zamAdd || []).forEach(function (x) {
        var r = document.createElement('tr');
        x.forEach(function (v) { var td = document.createElement('td'); td.textContent = v; r.appendChild(td); });
        var key = ddmm(x[0]);
        var after = [].slice.call(tb.rows).filter(function (o) { return ddmm(o.cells[0].textContent) > key; })[0];
        tb.insertBefore(r, after || null);
      });
    }
  }

  function run() { Object.keys(P).forEach(function (m) { try { apply(m, P[m]); } catch (e) { console.warn('ms-att-patch', m, e); } }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
