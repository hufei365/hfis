const path = require('path');
fis.set('namespace', 'test');

fis.unhook('components');


fis.hook('commonjs', {
    extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
});
fis.hook('node_modules');

fis.match('/node_modules/**.js', {
    isMod: true
})
// fis.match('/src/babel6/**.js', {
//     isMod: true,
//     parser: fis.plugin('babel-6', {
//         presets: [["env", {
//             "debug": true,
//             "targets": {
//                 // The % refers to the global coverage of users from browserslist
//                 "browsers": ["defaults",
//                     "chrome > 49",
//                     "ie > 8", 
//                     "edge > 11",
//                     "safari > 9",
//                     "not op_mini all"]
//             }
//         }]], 
//         sourceMap: 'inline'
//         // plugins: ["transform-es2015-unicode-regex"]
//     }),
// });
fis.match('/src/babel7/**.js', {
    isMod: true,
    parser: fis.plugin('babel-7', {
        
        sourceMap: 'inline'
        // plugins: ["transform-es2015-unicode-regex"]
    }),
});

// fis.match('{/components/lib/require/require.js, /resource-map.js}', {
//     isMod: false,
//     parser: null
// });

fis.match('/src/**\.{html, vm, tpl, jsp}:js', {
    useCompile: true,
    isMod: true,
    isJsLike: true,
    parser: [ fis.plugin('babel-7', {
        presets: [["env", {
            "debug": true,
            "targets": {
                // The % refers to the global coverage of users from browserslist
                "browsers": ["defaults",
                    "chrome > 49",
                    "ie > 8", 
                    "edge > 11",
                    "safari > 9",
                    "not op_mini all"]
            }
        }]],
        // plugins: [babePlugin]
    }), 
    parserPartial
]
});

function parserPartial(content, file, opt){
    // TOOD babel会把require放到 require.async 外面，导致require提前（在require.js未完全加载resourceMap的情况下加载
    return content;
}

function babelPlugin(){
    return {
        visitor: {
            Identifier(path) {
                // enter(path) {
                    if (path.isIdentifier({ name: "require" })
                        && path.parent.type === 'MemberExpression'
                        && path.parent.property
                        && path.parent.property.name === 'async'
                    ) {
                        console.log(1);
            
                        const p = path.findParent((path) => path.isExpressionStatement());
                        const callEx = path.findParent((path) => path.isCallExpression());
                        const fn = callEx.get('arguments').pop();
                        let siblings; 
                        console.log( siblings = p.getAllPrevSiblings());
                        siblings.reverse().forEach(n=>{
                            fn.get('body').unshiftContainer(
                                'body', n.node); 
                                n.remove();
                        });
            
                    }
                // }
            }
          }
    }
}

fis.match('/node_modules/**.js', {
    isMod: true,
    useSameNameRequire: true,
    parser: null
});

// 所有的文件产出到 static/ 目录下
fis.match('/**\.{js, html, css, scss, png, jpg}', {
    useCompile: true,
    release: '/$0',
    deploy: fis.plugin('local-deliver', {
        to: './output/static/',
    })
});

// 所有模板放到 tempalte 目录下
fis.match('**\.vm', {
    useCompile: true,
    deploy: fis.plugin('local-deliver', {
        to: './output/views/',
    })
});

fis.match('{/package\.json,/package-lock\.json}', {
    release: false
});








