import * as translateDATA  from "$DATA/global.translate.static.json"; 

export const translate = (str) => {
	return translateDATA[str] || str || "";
}
