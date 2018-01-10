import { SchemaClassFactory } from '@ngtools/json-schema';

// Input JSON schema json file
const factory = SchemaClassFactory<any>(require('@angular/cli/lib/config/schema.json'));

const schemaClass = new factory(null);

// Output .d.ts
console.log(schemaClass.$$serialize('text/x.dts')); 
