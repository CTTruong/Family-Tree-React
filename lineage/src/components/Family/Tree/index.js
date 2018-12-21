import React, { Component } from 'react';
import { connect } from 'react-redux';
import dTree from './dTree';

import './styles.css'

class FamilyTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [this.props.tree]
        };
    }

    componentDidMount() {
        dTree.init(this.state.treeData, {
            target: "#graph",
            debug: true,
            height: 800,
            width: 1200,
            callbacks: {
                nodeClick: function (name, extra) {
                    console.log(name);
                },
                textRenderer: function (name, extra, textClass) {
                    // THis callback is optinal but can be used to customize
                    // how the text is rendered without having to rewrite the entire node
                    // from screatch.
                    if (extra && extra.nickname)
                        name = name + " (" + extra.nickname + ")";
                    return "<p align='center' class='" + textClass + "'>" + name + "</p>";
                },
                nodeRenderer: function (name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
                    // This callback is optional but can be used to customize the
                    // node element using HTML.
                    let node = '';
                    node += '<div ';
                    node += 'style="height:100%;width:100%;" ';
                    node += 'class="' + nodeClass + '" ';
                    node += 'id="node' + id + '">\n';
                    node += textRenderer(name, extra, textClass);
                    node += '</div>';
                    return node;
                }
            }
        });
    }
    render() {
        return (
    
            <div id="graph">

            </div>
        );
    }
}

const mapStateToProps = (state) =>({
    tree: state.treeState.tree
})

export default connect(mapStateToProps)(FamilyTree)
