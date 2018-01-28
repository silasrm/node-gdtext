# node-gdtext
GD-Text for NodeJS

Using example/capaReadlist.js to generate images with readlist cover.

```javascript
var capa = new CapaReadlist(
    {
        titleFontPath: path.join(myPath, './fonts/Lora/Lora-Regular.ttf'),
        byFontPath: path.join(myPath, './fonts/Lato/Lato-LightItalic.ttf'),
        authorFontPath: path.join(myPath, './fonts/Lato/Lato-Regular.ttf')
    }
);
list = [
    {title: 'Teologia', author: 'Silas Ribas Martins'},
    {title: 'Conservadorismo', author: 'Silas Ribas Martins'},
    {title: 'Filosofia Grega', author: 'Silas Ribas'},
    {title: 'Treca', author: 'Thiago de Porto'},
    {title: 'Para ler da noite para o dia', author: 'Thiago Porto'},
    {title: 'Eu sei o que você fez no verão passado...ou não', author: 'Thiago Porto'},
];
for(var i in list) {
    var item = list[i];
    capa.generate(
        path.join(myPath, './output_' + i + '.png'),
        {
            title: item.title,
            author: item.author
        }
    );
}
```
