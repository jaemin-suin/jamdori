const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthLabel = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateLabel = document.getElementById('selectedDate');
const eventTitleInput = document.getElementById('eventTitle');
const eventTimeInput = document.getElementById('eventTime');
const eventDescInput = document.getElementById('eventDesc');
const saveEventBtn = document.getElementById('saveEvent');
const clearEventBtn = document.getElementById('clearEvent');
const eventListEl = document.getElementById('eventList');

const STORAGE_KEY = 'calendar-schedule-events-v1';
let current = new Date();
let selectedDate = null;
let events = loadEvents();

function formatMonthYear(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function renderWeekDays() {
  const weekDaysContainer = document.querySelector('.week-days');
  weekDaysContainer.innerHTML = weekDays.map(day => `<span>${day}</span>`).join('');
}

function renderCalendar() {
  currentMonthLabel.textContent = formatMonthYear(current);
  calendarGrid.innerHTML = '';

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startDay - 1; i >= 0; i -= 1) {
    cells.push({
      date: new Date(year, month - 1, prevMonthTotalDays - i),
      otherMonth: true,
    });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      otherMonth: false,
    });
  }

  while (cells.length % 7 !== 0) {
    const dayCount = cells.length - startDay - totalDays;
    cells.push({
      date: new Date(year, month + 1, dayCount + 1),
      otherMonth: true,
    });
  }

  cells.forEach((cell) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'day-cell';
    if (cell.otherMonth) cellEl.classList.add('other-month');

    const dateKey = formatDateKey(cell.date);
    const hasEvent = Array.isArray(events[dateKey]) && events[dateKey].length > 0;

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = cell.date.getDate();
    cellEl.dataset.date = dateKey;

    cellEl.appendChild(dayNumber);
    if (hasEvent) {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      cellEl.appendChild(dot);
    }

    cellEl.addEventListener('click', () => selectDate(cell.date, cell.otherMonth));
    calendarGrid.appendChild(cellEl);
  });

  if (!selectedDate || selectedDate.getMonth() !== current.getMonth() || selectedDate.getFullYear() !== current.getFullYear()) {
    selectDate(new Date(year, month, 1), false);
  }
}

function selectDate(date, ignoreMonth) {
  if (!ignoreMonth && date.getMonth() !== current.getMonth()) {
    current = new Date(date.getFullYear(), date.getMonth(), 1);
    renderCalendar();
    return;
  }

  selectedDate = date;
  const selectedKey = formatDateKey(date);
  selectedDateLabel.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekDays[date.getDay()]})`;
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  eventDescInput.value = '';
  renderEvents(selectedKey);
  document.querySelectorAll('.day-cell').forEach((cell) => cell.classList.remove('selected'));
  const selectedCell = Array.from(calendarGrid.children).find((cell) => cell.dataset.date === selectedKey);
  if (selectedCell) selectedCell.classList.add('selected');
}

function renderEvents(dateKey) {
  const dayEvents = events[dateKey] || [];
  eventListEl.innerHTML = dayEvents.length
    ? dayEvents
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((item, index) => `
          <li>
            <strong>${item.time || '시간 없음'} - ${item.title || '제목 없음'}</strong>
            <div>${item.description || '설명 없음'}</div>
          </li>
        `)
        .join('')
    : '<li>등록된 일정이 없습니다.</li>';
}

function addEvent() {
  if (!selectedDate) return;
  const title = eventTitleInput.value.trim();
  const time = eventTimeInput.value;
  const desc = eventDescInput.value.trim();
  if (!title) {
    alert('제목을 입력해주세요.');
    return;
  }

  const dateKey = formatDateKey(selectedDate);
  events[dateKey] = events[dateKey] || [];
  events[dateKey].push({ title, time, description: desc });
  saveEvents();
  renderEvents(dateKey);
  renderCalendar();
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  eventDescInput.value = '';
}

function clearEvents() {
  if (!selectedDate) return;
  const dateKey = formatDateKey(selectedDate);
  if (!events[dateKey] || events[dateKey].length === 0) {
    alert('삭제할 일정이 없습니다.');
    return;
  }
  if (!confirm('선택된 날짜의 모든 일정을 삭제하시겠습니까?')) return;
  delete events[dateKey];
  saveEvents();
  renderEvents(dateKey);
  renderCalendar();
}

prevMonthBtn.addEventListener('click', () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  renderCalendar();
});

saveEventBtn.addEventListener('click', addEvent);
clearEventBtn.addEventListener('click', clearEvents);

renderWeekDays();
renderCalendar();
