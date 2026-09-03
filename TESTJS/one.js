function tempEmailGen() {

    let newEmail;
    let n
    while (n < 100) {
        // newEmail = `temp${n + 1}@gmail.com`;
        // console.log(n);
        n++;
        return n
    }

}

console.log("New Email: " + tempEmailGen());
