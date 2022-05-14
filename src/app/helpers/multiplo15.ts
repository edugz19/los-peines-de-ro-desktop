import { AbstractControl, ValidationErrors } from '@angular/forms';

export class Multiplo15 {
    static multiplo15(control: AbstractControl): ValidationErrors| null {
        const nro = parseInt(control.value, 10);
        if (nro % 15 === 0) {
            return null;
        } else {}
            return { multiplo15: true };
    }
}
