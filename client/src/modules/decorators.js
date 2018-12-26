
export const monthes = [
	'янв', 'фев', 'мар', 'апр',
	'мая', 'июн', 'июл', 'авг',
	'сен', 'окт', 'ноя', 'дек',
];

export function renderDatetime (datetime) {
	if (!datetime.getTime()) return '-';

	const dtstr = datetime.toISOString();
	const time = dtstr.substr(11, 5);
	const day = datetime.getDate();
	const mon = datetime.getMonth();
	const year = datetime.getFullYear();
	const strMonth = monthes[mon];

	const now = new Date();
	if (year !== now.getFullYear()) {
		return `${day} ${strMonth} ${year} в ${time}`;
	} else if (mon !== now.getMonth() || day !== now.getDate()) {
		return `${day} ${strMonth} в ${time}`;
	} else {
		return `сегодня в ${time}`;
	}
}

export function renderQuantity (count, form1, form234, form5) {
	switch (count % 10) {
		case 1:
			return `${count} ${form1}`;
		case 2:
		case 3:
		case 4:
			return `${count} ${form234}`;
		default:
			return `${count} ${form5}`;
	}
}
