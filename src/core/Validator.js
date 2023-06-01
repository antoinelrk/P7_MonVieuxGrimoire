const parseBody = (data, scheme) => {
    let validated = []
    let failed = []

    /**
     * On boucle sur les propriétés
     */
    scheme.forEach(element => {
        /**
         * Pour chaque propriété, on vérifie si elle existe dans les data
         */
        if (element[0] in data) {
            // console.log(`${element[0]} existe`)
            let arrayOfRules = element[1].split("|")
            arrayOfRules.map((rule) => {
                /**
                 * Si c'est une sous-règle
                 */
                if (rule.includes(':')) {
                    const subrules = rule.split(':')
                    switch(subrules[0]) {
                        case "file":
                            /**
                             * Faire une règle pour les fichiers: utiliser des catégorie:
                             * image = jpg,gif,webp,png
                             * music = mp3,ogg,wav,flac
                             * etc...
                             */
                            console.log(subrules[1])
                            break;
                        case "between":
                            const between = minmax(data[element[0]], subrules[1])

                            if (between.passed) {
                                validated.push(JSON.parse(
                                    `{"${element[0]}": "${data[element[0]]}"}`
                                ))
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
                    console.log(rule)
                    switch(rule) {
                        case "string":
                            /**
                             * Faire une règles pour les chaînes de caratères
                             */
                            break;
                        case "number":
                            let number = isNumber(data[element[0]])
                            /**
                             * Améliorer la règle
                             */
                            break;
                    }
                }
            })
        }
    });

    return {
        validated: validated,
        failed: failed
    }
}

const isNumber = (value) => typeof value === "number"
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
            message: `doit être entre ${min} et ${max}`
        }
    }
}

export default {
    parseBody
}