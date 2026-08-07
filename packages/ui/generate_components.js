const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const formsDir = path.join(__dirname, 'src', 'forms');

const components = [
  'Buttons', 'Cards', 'DataTable', 'SearchBox', 'FilterPanel', 'Drawer', 
  'Dialog', 'ConfirmationDialog', 'DatePickerWrapper', 'StatusChip', 
  'PriorityChip', 'Avatar', 'EmptyState', 'LoadingState', 'ErrorState', 
  'SkeletonLoader', 'MetricCard', 'DashboardWidget'
];

const forms = [
  'TextField', 'PhoneField', 'CurrencyField', 'PercentageField', 'DateField', 
  'Autocomplete', 'AddressSelector', 'FileUpload', 'ImageUpload', 'RichNotesEditor'
];

function createComponents(dir, list) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const exports = [];
  for (const name of list) {
    let content = `import React from 'react';\n\n`;
    content += `export interface ${name}Props {\n  [key: string]: any;\n}\n\n`;
    content += `export const ${name}: React.FC<${name}Props> = (props) => {\n`;
    content += `  return <div {...props}>${name}</div>;\n`;
    content += `};\n`;
    
    // For DataTable we need a specific folder and implementation.
    if (name === 'DataTable') {
      const dtDir = path.join(dir, name);
      if (!fs.existsSync(dtDir)) fs.mkdirSync(dtDir, { recursive: true });
      fs.writeFileSync(path.join(dtDir, `${name}.tsx`), content);
      exports.push(`export * from './${name}/${name}';`);
    } else {
      const compDir = path.join(dir, name);
      if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
      fs.writeFileSync(path.join(compDir, `${name}.tsx`), content);
      exports.push(`export * from './${name}/${name}';`);
    }
  }
  
  fs.writeFileSync(path.join(dir, 'index.ts'), exports.join('\n') + '\n');
}

createComponents(componentsDir, components);
createComponents(formsDir, forms);
