const parseBody = (dataRaw, scheme) => {
    let validated = {}
    let failed = []

    /**
     * On boucle sur les propriétés
     */
    console.log(dataRaw.body.book)
    const data = {...JSON.parse(dataRaw.body.book), ...{image: dataRaw.file}}

    scheme.forEach(element => {
        /**
         * Pour chaque propriété, on vérifie si elle existe dans les data
         */
        if (element[0] in data) {
            let arrayOfRules = element[1].split("|")
            arrayOfRules.map((rule) => {
                /**
                 * Si c'est une sous-règle
                 */
                if (rule.includes(':')) {
                    const subrules = rule.split(':')
                    switch(subrules[0]) {
                        case "file":
                            const fileCheck = respectMimetype(data[element[0]].mimetype, subrules[1])
                            if (fileCheck.passed) {
                                validated = {
                                    ...validated,
                                    ...JSON.parse(`{"${element[0]}": "${data[element[0]]}"}`)
                                }
                            } else {
                                failed.push(JSON.parse(
                                    `{"${element[0]}": "${fileCheck.message}"}`
                                ))
                            }
                            /**
                             * Faire une règle pour les fichiers: utiliser des catégorie:
                             * image = jpg,gif,webp,png
                             * music = mp3,ogg,wav,flac
                             * etc...
                             */
                            break;
                        case "between":
                            const between = minmax(data[element[0]], subrules[1])

                            if (between.passed) {
                                validated = {
                                    ...validated,
                                    ...JSON.parse(`{"${element[0]}": "${data[element[0]]}"}`)
                                }
                            } else {
                                failed.push(JSON.parse(
                                    `{"${element[0]}": "${element[0]} ${between.message}"}`
                                ))
                            }
                            break;
                    }
                }
                /**
                 * Sinon
                 */
                else {
                    switch(rule) {
                        case "string":
                            /**
                             * Faire une règles pour les chaînes de caratères
                             */
                            break;
                        case "number":
                            let number = isNumber(data[element[0]])
                            if (number.passed) {
                                validated = {
                                    ...validated,
                                    ...JSON.parse(`{"${element[0]}": "${data[element[0]]}"}`)
                                }
                            } else {
                                failed.push(JSON.parse(
                                    `{"${element[0]}": "${element[0]} ${number.message}"}`
                                ))
                            }
                            /**
                             * Améliorer la règle
                             */
                            break;
                    }
                }
            })
        } else {
            element[1].split("|").map((rule) => {
                if (rule === "required") {
                    failed.push(JSON.parse(
                        `{"${element[0]}": "Le field ${element[0]} ne doit pas être null"}`
                    ))
                }
            })
        }
    });

    return {
        validated: validated,
        failed: failed
    }
}

const isNumber = (value) => {
    if (typeof value === "number") {
        return {
            passed: true
        }
    } else {
        return {
            passed: false,
            message: `doit être un entier`
        }
    }
    
}
const respectMimetype = (value, rule) => {
    let result = {
        passed: false,
        message: ``
    }
    switch (rule) {
        case "image":
            const mime = value.split(`/`).pop()
            const imagesMimeType = ['jpg', 'jpeg', 'png', 'gif', 'webp']
            // const imagesMimeType = ['mp4']
            if (imagesMimeType.some((value) => value === mime)) {
                result.passed = true
            } else {
                result.passed = false,
                result.message = `Le fichier doit être une ${rule} valide`
            }
            break
        default: result
    }

    return result
}
const minmax = (value, interval) => {
    const min = parseInt(interval.split(',')[0])
    const max = parseInt(interval.split(',')[1])

    if ((value.length >= min) && (value.length <= max)) {
        return {
            passed: true
        }
    } else {
        return {
            passed: false,
            message: `doit être entre ${min} et ${max} caractères`
        }
    }
}

export default {
    parseBody
}