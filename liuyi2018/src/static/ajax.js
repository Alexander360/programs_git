function getJSON(url) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);

		xhr.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					resolve(this.responseText, this);
				}
				else {
					let resJson = {
						code: this.status,
						response: this.response
					};
					reject(resJson, this);
				}
			}
		};
		xhr.send();
	});
}
function postJSON(url, data) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.setRequestHeader(
			'Content-type',
			'application/x-www-form-urlencoded'
		);

		xhr.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					resolve(JSON.parse(this.responseText), this);
				}
				else {
					let resJson = {
						code: this.status,
						response: this.response,
						age: 90
					};
					// console.log(this.status);
					reject(resJson, this);
				}
			}
		};

		xhr.send(JSON.stringify(data));
	});
}
const ajax = {
	getJSON,
	postJSON
};
export default ajax;
