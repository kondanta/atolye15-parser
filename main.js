const fs = require("fs");


class JsonToYaml {
	constructor() {
		console.log("Up to go.");
	}
	/**
	 * Data from the file
	 * @param  {String}   name     Name of the file
	 * @param  {Function} callback Callback
	 */
	fileReader(name, callback) {
		fs.readFile(name, "utf8", (err, data) => {
			if (err) { console.log("Something happened: " + err.message); }
			callback(null, data);
		});
	}

	/**
	 * Maps parsed data
	 */
	outputBuilder(data) {
		const indent = "  ";
		let output = "---\n";
		let mock = "";

		Object.keys(data).forEach(function(key) {
			const val = data[key];
			// UGH....
			// FIXME
			if (typeof val === "object") {
				if (Array.isArray(val)) {
					val.forEach(function(d) {
						mock += "- " + "\"" + d + "\"" + "\n" + indent;
					});
					output += key + " : " + "\n" + indent + mock + "\n";
				} else {
					Object.keys(val).forEach(function(innerKey) {
						const innerVal = val[innerKey]; // [a, b]

						mock += "\"" + innerVal + "\"" + "\n";
						output += key + ":\n" + indent + "- " + innerKey + " : " + mock;
						mock = "";
					});
				}
			} else {
				output += key + " : " + "\"" + val + "\"" + "\n";
			}
		});
		process.stdout.write(output);
		return output;
	}
	/**
	 * Creates the yaml file
	 * @param  {String} data data that going to be used for creating the yaml file.
	 */
	fileWriter(data, option) {
		fs.writeFile(option.output, data, function(err) {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	}

	/**
	 * Extra layer
	 */
	parser(data, option) {
		data = JSON.parse(data);
		const yaml = this.outputBuilder(data);
		this.fileWriter(yaml, option);
	}


	// there thou go.
	/**
	 * Triggers all of the functions
	 * @param  {Object} options input file and output file names
	 */
	init(options) {
		this.fileReader(options.input, (err, data) => {
			const x = this.parser(data, options);
		});
	}
}

// CLI Params.
const options = {
	input: process.argv[2],
	output: process.argv[3]
};

const obj = new JsonToYaml();
obj.init(options);